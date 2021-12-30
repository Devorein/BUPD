import {
	ApiResponse,
	DeleteCriminalPayload,
	DeleteCriminalResponse,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { CriminalModel } from '../models';
import { handleError, logger, removeFields } from '../utils';

const CriminalController = {
	async update(
		req: Request<any, any, UpdateCriminalPayload>,
		res: Response<ApiResponse<UpdateCriminalResponse>>
	) {
		try {
			const payload = req.body;
			const [criminal] = await CriminalModel.find({ filter: { criminal_id: payload.criminal_id } });
			if (!criminal) {
				res.json({
					status: 'error',
					message: "Criminal doesn't exist",
				});
			} else {
				await CriminalModel.update(
					{
						criminal_id: payload.criminal_id,
					},
					removeFields(payload, ['criminal_id'])
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
			res.json({
				status: 'error',
				message: "Couldn't update the criminal",
			});
		}
	},
	async delete(
		req: Request<any, any, DeleteCriminalPayload>,
		res: Response<DeleteCriminalResponse>
	) {
		const criminal = await CriminalModel.findByCriminalID(req.body.criminal_id);
		if (criminal[0]) {
			const result = await CriminalModel.delete(req.body);
			if (result) {
				res.json({
					status: 'success',
					data: criminal[0],
				});
			}
		} else {
			res.json({
				status: 'error',
				message: 'No valid criminals given to delete',
			});
		}
	},
	async updateOnCriminalId(
		req: Request<any, any, UpdateCriminalPayload>,
		res: Response<ApiResponse<UpdateCriminalResponse>>
	) {
		try {
			const payload = req.body;
			const [criminal] = await CriminalModel.find({
				filter: { criminal_id: req.params.criminal_id },
			});
			if (!criminal) {
				handleError(res, 404, "Criminal doesn't exist");
			} else {
				await CriminalModel.update(
					{
						criminal_id: req.params.criminal_id,
					},
					removeFields(payload, ['criminal_id'])
				);
				res.json({
					status: 'success',
					data: {
						...req.params,
						...payload,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update the criminal");
		}
	},
	async deleteOnCriminalId(
		req: Request<any, any, undefined>,
		res: Response<DeleteCriminalResponse>
	) {
		const criminal = await CriminalModel.findByCriminalID(req.params.criminal_id);
		if (criminal[0]) {
			const result = await CriminalModel.delete({ criminal_id: req.params.criminal_id });
			if (result) {
				res.json({
					status: 'success',
					data: criminal[0],
				});
			}
		} else {
			handleError(res, 404, 'No valid criminals given to delete');
		}
	},
};

export default CriminalController;
