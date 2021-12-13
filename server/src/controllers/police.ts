import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { ApiResponse, PoliceJwtPayload, UpdatePolicePayload, UpdatePoliceResponse } from '../types';
import { generatePoliceJwtToken, removeFields } from '../utils';

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const police = await PoliceModel.find({ email: jwtPayload.email });
			const updatedPoliceData = await PoliceModel.update(
				{
					nid: jwtPayload.nid,
					email: jwtPayload.email,
				},
				payload
			);
			if (!updatedPoliceData || !police) {
				res.json({
					status: 'error',
					message: "Police doesn't exist",
				});
			} else {
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
			console.log(err.message);
			res.json({
				status: 'error',
				message: "Couldn't update your profile",
			});
		}
	},
};

export default PoliceController;
