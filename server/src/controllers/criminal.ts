import { Request, Response } from 'express';
import {
	ApiResponse,
	DeleteCriminalPayload,
	DeleteCriminalResponse,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '../shared.types';
import { CriminalModel } from '../models';

import { logger, removeFields } from '../utils';

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
};

export { CriminalController };
