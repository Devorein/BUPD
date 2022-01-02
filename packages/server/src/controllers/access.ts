import {
	AdminJwtPayload,
	ApiResponse,
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessesPayload,
	GetAccessesResponse,
	IAccess,
	IAccessPopulated,
	PoliceJwtPayload,
	UpdateAccessPayload,
	UpdateAccessResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import AccessModel from '../models/Access';
import { paginate } from '../models/utils/paginate';
import { generateInsertQuery, logger, query } from '../utils';
import { convertClientQuery } from '../utils/convertClientQuery';
import { inflateObject } from '../utils/inflateObject';

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
				approved: 2,
				police_nid: jwtPayload.nid,
				type: payload.criminal_id !== null ? 'criminal' : 'case',
				criminal_id: payload.criminal_id,
				case_no: payload.case_no,
				admin_id: null,
			};
			await query(generateInsertQuery(access, 'Access'));
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

	find: async (
		req: Request<any, any, any, GetAccessesPayload>,
		res: Response<GetAccessesResponse>
	) => {
		res.json({
			status: 'success',
			data: await paginate<IAccessPopulated>(
				{
					filter: convertClientQuery(req.query.filter),
					limit: req.query.limit,
					sort: [req.query.sort],
					next: req.query.next,
					select: [
						'Access.permission',
						'Access.access_id',
						'Access.police_nid',
						'Access.type',
						'Access.criminal_id',
						'Access.case_no',
						'Access.admin_id',
						'Police.email',
						'Police.phone',
						'Police.address',
						'Police.designation',
						'Police.nid',
						'Police.name',
						'Police.rank',
					],
					joins: [['Access', 'Police', 'police_nid', 'nid']],
				},
				'Access',
				'access_id',
				(rows) => rows.map((row) => inflateObject(row, 'Access'))
			),
		});
	},

	async update(
		req: Request<{ access_id: number }, any, UpdateAccessPayload>,
		res: Response<ApiResponse<UpdateAccessResponse>>
	) {
		try {
			const accessId = req.params.access_id;
			const decoded = req.jwt_payload as AdminJwtPayload;
			const payload = req.body;
			const [access] = await AccessModel.find({ filter: [{ access_id: accessId }] });
			if (!access) {
				res.json({
					status: 'error',
					message: "Access doesn't exist",
				});
			} else {
				await AccessModel.update(
					[
						{
							access_id: accessId,
						},
					],
					{
						...payload,
						admin_id: decoded.id,
					}
				);
				res.json({
					status: 'success',
					data: {
						...access,
						...payload,
						admin_id: decoded.id,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			res.json({
				status: 'error',
				message: "Couldn't update access",
			});
		}
	},
};

export default AccessController;
