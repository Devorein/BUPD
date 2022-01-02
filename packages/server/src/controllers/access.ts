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
import { generateInsertQuery, handleError, logger, query } from '../utils';
import { convertAccessFilter } from '../utils/convertClientQuery';
import {
	getAccessAttributes,
	getCasefileAttributes,
	getCriminalAttributes,
	getPoliceAttributes,
} from '../utils/generateAttributes';
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
			handleError(res);
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
					filter: convertAccessFilter(req.query.filter),
					limit: req.query.limit,
					sort: req.query.sort ? [req.query.sort] : [],
					select: [
						...getPoliceAttributes('Police', ['password', 'nid']),
						...getAccessAttributes('Access'),
						...getCasefileAttributes('Casefile', ['case_no']),
						...getCriminalAttributes('Criminal', ['criminal_id']),
					],
					next: req.query.next,
					joins: [
						['Access', 'Police', 'police_nid', 'nid'],
						['Access', 'Criminal', 'criminal_id', 'criminal_id', 'LEFT'],
						['Access', 'Casefile', 'case_no', 'case_no', 'LEFT'],
					],
				},
				'Access',
				'access_id',
				(rows) =>
					rows.map((row) => {
						const inflatedObject = inflateObject(row, 'Access') as IAccessPopulated;
						inflatedObject.casefile = inflatedObject.casefile?.case_no
							? inflatedObject.casefile
							: null;
						inflatedObject.criminal = inflatedObject.criminal?.criminal_id
							? inflatedObject.criminal
							: null;
						return inflatedObject;
					})
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
				handleError(res, 404, "Access doesn't exist");
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
			handleError(res, 500, "Couldn't update access");
		}
	},
};

export default AccessController;
