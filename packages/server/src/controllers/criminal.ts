import {
	ApiResponse,
	DeleteCriminalResponse,
	GetCriminalPayload,
	GetCriminalResponse,
	ICriminal,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { CriminalModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { handleError, logger } from '../utils';
import Logger from '../utils/logger';

const CriminalController = {
	async update(
		req: Request<{ criminal_id: number }, any, UpdateCriminalPayload>,
		res: Response<ApiResponse<UpdateCriminalResponse>>
	) {
		try {
			const criminalId = req.params.criminal_id;
			const payload = req.body;
			const [criminal] = await CriminalModel.find({ filter: [{ criminal_id: criminalId }] });
			if (!criminal) {
				handleError(res, 404, "Criminal doesn't exist");
			} else {
				await CriminalModel.update(
					[
						{
							criminal_id: criminalId,
						},
					],
					payload
				);
				res.json({
					status: 'success',
					data: {
						...criminal,
						...payload,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update the criminal");
		}
	},
	async delete(
		req: Request<{ criminal_id: number }, any, undefined>,
		res: Response<DeleteCriminalResponse>
	) {
		try {
			const criminal = await CriminalModel.findByCriminalID(req.params.criminal_id);
			if (criminal[0]) {
				const result = await CriminalModel.delete(req.params.criminal_id);
				if (result) {
					res.json({
						status: 'success',
						data: criminal[0],
					});
				}
			} else {
				handleError(res, 404, "Criminal doesn't exist");
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async find(req: Request<any, any, any, GetCriminalPayload>, res: Response<GetCriminalResponse>) {
		try {
			res.json({
				status: 'success',
				data: await paginate<ICriminal>(
					{
						filter: [],
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
					},
					'Criminal',
					'criminal_id'
				),
			});
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
};

export default CriminalController;
