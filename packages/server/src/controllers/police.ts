import {
	ApiResponse,
	DeletePolicePayload,
	DeletePoliceResponse,
	GetPoliceResponse,
	GetPolicesPayload,
	GetPolicesResponse,
	IPolice,
	UpdatePolicePayload,
	UpdatePoliceResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { generatePoliceJwtToken, handleError, logger, removeFields } from '../utils';
import { convertPoliceFilter } from '../utils/convertClientQuery';
import { getPoliceAttributes } from '../utils/generateAttributes';
import Logger from '../utils/logger';

const PoliceController = {
	async update(
		req: Request<{ nid: number }, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload!;
			const payload = req.body;
			const [police] = await PoliceModel.find({ filter: [{ nid: req.params.nid }] });
			if (!police) {
				handleError(res, 404, `No Police exists with nid ${req.params.nid}`);
			} else {
				// If its not admin and a police, we need to check if the current police's nid is the same as the requested nid
				if (jwtPayload.type === 'admin' || jwtPayload.nid === req.params.nid) {
					await PoliceModel.update(
						[
							{
								nid: req.params.nid,
							},
						],
						removeFields(payload, ['email'])
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
				} else {
					handleError(res, 401, 'Unauthorized');
				}
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update your profile");
		}
	},
	async get(req: Request<any, any, any, GetPolicesPayload>, res: Response<GetPolicesResponse>) {
		try {
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
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async delete(req: Request<DeletePolicePayload, any>, res: Response<DeletePoliceResponse>) {
		try {
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
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async getOnNid(req: Request<{ nid: number }>, res: Response<GetPoliceResponse>) {
		try {
			const police = await PoliceModel.findByNid(req.params.nid);
			if (police) {
				res.json({
					status: 'success',
					data: removeFields(police, ['password']),
				});
			} else {
				handleError(res, 404, `No police with nid, ${req.params.nid} found`);
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
};

export default PoliceController;
