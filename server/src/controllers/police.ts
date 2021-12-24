import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import {
	ApiResponse,
	GetPolicesPayload,
	GetPolicesResponse,
	PoliceJwtPayload,
	UpdatePolicePayload,
	UpdatePoliceResponse,
} from '../types';
import { generateCountQuery, generatePoliceJwtToken, query, removeFields } from '../utils';

const PoliceController = {
	async update(
		req: Request<any, any, UpdatePolicePayload>,
		res: Response<ApiResponse<UpdatePoliceResponse>>
	) {
		try {
			const jwtPayload = req.jwt_payload as PoliceJwtPayload;
			const payload = req.body;
			const [police] = await PoliceModel.find({ filter: { email: jwtPayload.email } });
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
	async get(req: Request<any, any, GetPolicesPayload>, res: Response<GetPolicesResponse>) {
		const polices = await PoliceModel.find(req.body);
		const policeCount = (await query(
			generateCountQuery({ filter: req.body?.filter }, 'police')
		)) as Array<{ count: number }>;

		if (polices) {
			res.json({
				status: 'success',
				data: {
					items: polices,
					next: null,
					total: policeCount[0].count,
				},
			});
		}
	},
};

export default PoliceController;
