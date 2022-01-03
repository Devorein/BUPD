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
import { convertPoliceFilter } from '../utils/convertClientQuery';
import { getPoliceAttributes } from '../utils/generateAttributes';

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
				handleError(res, 404, `No Police exists with email ${jwtPayload.email}`);
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
			handleError(res, 500, "Couldn't update your profile");
		}
	},
	async get(req: Request<any, any, any, GetPolicesPayload>, res: Response<GetPolicesResponse>) {
		res.json({
			status: 'success',
			data: await paginate<IPolice>(
				{
					...req.query,
					sort: req.query.sort ? [req.query.sort] : [],
					filter: convertPoliceFilter(req.query.filter),
					// Custom select to remove password field
					select: getPoliceAttributes(undefined, ['password']),
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
					data: removeFields(police, ['password']),
				});
			}
		} else {
			handleError(res, 404, 'No valid polices given to delete');
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
