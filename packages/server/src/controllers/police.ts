import {
	ApiResponse,
	DeletePolicePayload,
	DeletePoliceResponse,
	GetPoliceResponse,
	GetPolicesPayload,
	GetPolicesResponse,
	IPolice,
	PoliceJwtPayload,
	UpdatePolicePayload,
	UpdatePoliceResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { generatePoliceJwtToken, handleError, logger, removeFields } from '../utils';

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const [police] = await PoliceModel.find({ filter: [{ email: jwtPayload.email }] });
			if (!police) {
				res.json({
					status: 'error',
					message: "Police doesn't exist",
				});
			} else {
				await PoliceModel.update(
					[
						{
							nid: jwtPayload.nid,
							email: jwtPayload.email,
						},
					],
					payload
				);
				res.json({
					status: 'success',
					data: {
						...removeFields(
							{
								...police,
								...payload,
							},
							['password']
						),
						token: generatePoliceJwtToken(police),
					},
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't update your profile",
			});
		}
	},
	async get(req: Request<any, any, GetPolicesPayload>, res: Response<GetPolicesResponse>) {
		res.json({
			status: 'success',
			data: await paginate<IPolice>(
				{
					...req.query,
					// Custom select to remove password field
					select: ['nid', 'name', 'email', 'address', 'designation', 'phone', 'rank'],
				},
				'Police',
				'nid'
			),
		});
	},
	async delete(req: Request<DeletePolicePayload, any>, res: Response<DeletePoliceResponse>) {
		const police = await PoliceModel.findByNid(req.params.nid);
		if (police) {
			const result = await PoliceModel.delete(req.params.nid);
			if (result) {
				res.json({
					status: 'success',
					data: police,
				});
			}
		} else {
			res.json({
				status: 'error',
				message: 'No valid polices given to delete',
			});
		}
	},
	async getOnNid(req: Request<{ nid: number }>, res: Response<GetPoliceResponse>) {
		const police = await PoliceModel.findByNid(req.params.nid);
		if (police) {
			res.json({
				status: 'success',
				data: removeFields(police, ['password']),
			});
		} else {
			handleError(res, 404, `No police with nid, ${req.params.nid} found`);
		}
	},
};

export default PoliceController;
