import {
	ApiResponse,
	DeleteCriminalResponse,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { CriminalModel } from '../models';
import { handleError, logger } from '../utils';

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
				res.json({
					status: 'error',
					message: "Criminal doesn't exist",
				});
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
			res.json({
				status: 'error',
				message: "Couldn't update the criminal",
			});
		}
	},
	async delete(
		req: Request<{ criminal_id: number }, any, undefined>,
		res: Response<DeleteCriminalResponse>
	) {
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
	},
};

export default CriminalController;
