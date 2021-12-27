import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import AccessModel from '../models/Access';

import {
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessPayload,
	GetAccessResponse,
	IAccess,
} from '../shared.types';
import { ApiResponse, PoliceJwtPayload } from '../types';
import { generateCountQuery, generateInsertQuery, query } from '../utils';

export default {
	create: async (
		req: Request<any, any, CreateAccessPayload>,
		res: Response<ApiResponse<CreateAccessResponse>>
	) => {
		try {
			const jwtPayload = req.jwt_payload! as PoliceJwtPayload;
			const payload = req.body;
			const access: Omit<IAccess, 'access_id'> = {
				permission: payload.permission,
				approved: false,
				police_nid: jwtPayload.nid,
				type: payload.criminal_id !== null ? 'criminal' : 'case',
				criminal_id: payload.criminal_id,
				case_no: payload.case_no,
				admin_id: null,
			};
			await query(generateInsertQuery(access, 'access'));
			res.json({
				status: 'success',
				data: '',
			});
		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				message: 'Something went wrong. Please try again.',
			});
		}
	},
	find: async (req: Request<any, any, GetAccessPayload>, res: Response<GetAccessResponse>) => {
		const access = await AccessModel.find(req.body);
		const accessCount = (await query(
			generateCountQuery({ filter: req.body?.filter }, 'Access')
		)) as RowDataPacket[];
		res.json({
			status: 'success',
			data: {
				total: accessCount[0][0]?.count,
				items: access,
				next: null,
			},
		});
	},
};
