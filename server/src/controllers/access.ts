import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import * as yup from 'yup';
import AccessModel from '../models/Access';

import {
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessPayload,
	GetAccessResponse,
	IAccess,
} from '../shared.types';
import { ApiResponse, PoliceJwtPayload } from '../types';
import { generateCountQuery, generateInsertQuery, logger, query } from '../utils';

const AccessPayload = {
	get: yup.object().shape({
		filter: yup
			.object({
				approved: yup.number().min(0).max(1),
				permission: yup.array().of(yup.string().oneOf(['read', 'write', 'update', 'delete'])),
				type: yup.string().oneOf(['case', 'criminal']),
			})
			.strict(),
		sort: yup
			.array()
			.test(
				(arr) =>
					arr === undefined ||
					(arr.length === 2 &&
						arr[0].match(/^(criminal_id|case_no|approved|permission)$/) &&
						(arr[1] === -1 || arr[1] === 1))
			)
			.strict(),
		limit: yup.number().strict(),
	}),
	create: yup
		.object()
		.shape({
			case_no: yup.number().nullable(),
			criminal_id: yup.number().nullable(),
			permission: yup.string().oneOf(['read', 'write', 'update', 'delete']).required(),
		})
		.test(
			(obj) =>
				(!obj.case_no && Boolean(obj.criminal_id)) || (!obj.criminal_id && Boolean(obj.case_no))
		)
		.strict(),
};

const AccessController = {
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
			logger.error(err);
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

export { AccessController, AccessPayload };
