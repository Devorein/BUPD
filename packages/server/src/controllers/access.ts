import {
	AdminJwtPayload,
	ApiResponse,
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessPayload,
	GetAccessResponse,
	IAccess,
	PaginatedResponse,
	PoliceJwtPayload,
	UpdateAccessPayload,
	UpdateAccessResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import AccessModel from '../models/Access';
import { generateCountQuery, generateInsertQuery, logger, query, removeFields } from '../utils';

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

	find: async (req: Request<any, any, any, GetAccessPayload>, res: Response<GetAccessResponse>) => {
		const requestQuery = req.query;
		const accessRows = await AccessModel.find({
			...requestQuery,
			// Order of next would be the same as sort[1]
			next: req.query.next,
		});
		const accessRowsCount = (await query(
			generateCountQuery(requestQuery.filter ?? {}, 'Access')
		)) as RowDataPacket[];

		let next: PaginatedResponse<any>['next'] = null;
		// Get the last row
		const lastRow = accessRows[accessRows.length - 1];
		if (lastRow) {
			// IF the last row exists, then we need to set its id as next.id
			next = {
				id: lastRow.access_id,
			};
		}

		res.json({
			status: 'success',
			data: {
				total: accessRowsCount[0][0]?.count,
				items: accessRows,
				next,
			},
		});
	},

	async update(
		req: Request<any, any, UpdateAccessPayload>,
		res: Response<ApiResponse<UpdateAccessResponse>>
	) {
		try {
			const decoded = req.jwt_payload as AdminJwtPayload;
			const payload = req.body;
			const [accessExist] = await AccessModel.find({ filter: { access_id: payload.access_id } });
			console.log(accessExist);
			if (!accessExist) {
				res.json({
					status: 'error',
					message: "Access doesn't exist",
				});
			} else {
				await AccessModel.update(
					{
						access_id: payload.access_id,
					},
					{
						...removeFields(payload, ['access_id']),
						admin_id: decoded.id,
					}
				);
				res.json({
					status: 'success',
					data: {
						...accessExist,
						...payload,
						admin_id: decoded.id,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't update the access request",
			});
		}
	},
};

export default AccessController;
