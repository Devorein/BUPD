import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { ApiResponse, PoliceJwtPayload, UpdatePolicePayload, UpdatePoliceResponse, SuccessApiResponse, IPolice } from '../types';
import { generatePoliceJwtToken, removeFields } from '../utils';

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const [police] = await PoliceModel.find({ email: jwtPayload.email });
			if (!police) {
				res.json({
					status: 'error',
					message: "Police doesn't exist",
				});
			} else {
				await PoliceModel.update(
					{
						nid: jwtPayload.nid,
						email: jwtPayload.email,
					},
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
			res.json({
				status: 'error',
				message: "Couldn't update your profile",
			});
		}
	},
	async get(
		req: Request<any>,
		res: Response<SuccessApiResponse<IPolice[]>>
	) {
		const polices = await PoliceModel.find(req.query);
		if (polices) {
			res.json({
				status: 'success',
				data: polices,//TODO exclude password
			});
		}
	}
};

export default PoliceController;
