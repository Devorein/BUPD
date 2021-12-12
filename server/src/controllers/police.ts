import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import { ApiResponse, PoliceJwtPayload, UpdatePolicePayload, UpdatePoliceResponse } from '../types';
import { signToken } from '../utils';

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const policeData = await PoliceModel.findByEmail(jwtPayload.email);
			const updatedPoliceData = await PoliceModel.update(
				jwtPayload.nid,
				jwtPayload.email,
				req.body
			);
			if (!updatedPoliceData || !policeData) {
				res.json({
					status: 'error',
					message: "Police doesn't exist",
				});
			} else {
				const jwtToken = signToken({
					role: 'police',
					nid: updatedPoliceData.nid,
					email: updatedPoliceData.email,
				});

				res.json({
					status: 'success',
					data: {
						email: updatedPoliceData.email ?? policeData.email,
						name: updatedPoliceData.name ?? policeData.name,
						nid: updatedPoliceData.nid ?? policeData.nid,
						token: jwtToken,
					},
				});
			}
		} catch (_) {
			res.json({
				status: 'error',
				message: "Couldn't update your profile",
			});
		}
	},
};

export default PoliceController;
