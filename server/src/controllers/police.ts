import { Request, Response } from 'express';
import { PoliceModel } from '../models';
import {
	ApiResponse,
	DeletePolicePayload,
	DeletePoliceResponse,
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
	async delete(req: Request<any, any, DeletePolicePayload>, res: Response<DeletePoliceResponse>) {
		//const polices = await PoliceModel.find( {	filter: {	nid: req.body.nid, rank: null, designation: null} });
		//if (polices.length !== 1) { //gives sql query 'SELECT email,phone,address,designation,`rank`,name,nid FROM police WHERE nid=10245 AND  AND ;'
		if (req.body.nid !== undefined || req.body.nid !== null) {
			const result = await PoliceModel.delete(req.body);
			res.json({
				status: 'success',
				data: req.body// need to change it to ipolice
			});
		} else {
			res.json({
				status: 'error',
				message: 'No polices given to delete'
			})
		}
	}
};

export default PoliceController;
