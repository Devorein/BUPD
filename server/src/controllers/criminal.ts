import { Request, Response } from 'express';
import { ApiResponse, UpdateCriminalPayload, UpdateCriminalResponse } from '../shared.types';
import { CriminalModel } from '../models';

import { removeFields } from '../utils';

const CriminalController = {
	async update(
		req: Request<any, any, UpdateCriminalPayload>,
		res: Response<ApiResponse<UpdateCriminalResponse>>
	) {
		try {
			const payload = req.body;
            console.log(payload);
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
			console.log(err);
			res.json({
				status: 'error',
				message: "Couldn't update the criminal",
			});
		}
	},
};

export { CriminalController };
