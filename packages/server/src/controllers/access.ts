import {
	AdminJwtPayload,
	ApiResponse,
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessesPayload,
	GetAccessesResponse,
	IAccess,
	PoliceJwtPayload,
	UpdateAccessPayload,
	UpdateAccessResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import AccessModel from '../models/Access';
import { paginate } from '../models/utils/paginate';
import { generateInsertQuery, logger, query } from '../utils';

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
				approved: 0,
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

	find: async (
		req: Request<any, any, any, GetAccessesPayload>,
		res: Response<GetAccessesResponse>
	) => {
		res.json({
			status: 'success',
			data: await paginate<IAccess>(req.query, 'Access', 'access_id'),
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
			const [access] = await AccessModel.find({ filter: { access_id: accessId } });
			if (!access) {
				res.json({
					status: 'error',
					message: "Access doesn't exist",
				});
			} else {
				await AccessModel.update(
					{
						access_id: accessId,
					},
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
				message: "Couldn't update the access request",
			});
		}
	},
};

export default AccessController;
