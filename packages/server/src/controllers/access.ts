import {
	AdminJwtPayload,
	ApiResponse,
	CreateAccessPayload,
	CreateAccessResponse,
	GetAccessesPayload,
	GetAccessesResponse,
	GetPoliceAccessesPayload,
	GetPoliceAccessesResponse,
	IAccess,
	IAccessPopulated,
	PoliceJwtPayload,
	UpdateAccessPayload,
	UpdateAccessResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import AccessModel from '../models/Access';
import { paginate } from '../models/utils/paginate';
import { generateInsertQuery, generateSelectQuery, handleError, logger, query } from '../utils';
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
			const filter = {
				permission: payload.permission,
				police_nid: jwtPayload.nid,
				type: payload.criminal_id ? 'criminal' : 'case',
			} as any;

			if (payload.case_no) {
				filter.case_no = payload.case_no;
			} else if (payload.criminal_id) {
				filter.criminal_id = payload.criminal_id;
			}

			// Check if the police has requested an access of similar permission to same entity
			const [previousAccess] = (await query(
				generateSelectQuery(
					{
						filter: [filter],
					},
					'Access'
				)
			)) as RowDataPacket[];

			if (previousAccess.length !== 0) {
				handleError(res, 401, 'An access already exist');
			} else {
				const access: Omit<IAccess, 'access_id'> = {
					permission: payload.permission,
					approved: 2,
					police_nid: jwtPayload.nid,
					type: payload.criminal_id ? 'criminal' : 'case',
					criminal_id: payload.criminal_id,
					case_no: payload.case_no,
					admin_id: null,
				};
				const [response] = (await query(generateInsertQuery(access, 'Access'))) as OkPacket[];

				res.json({
					status: 'success',
					data: {
						...access,
						access_id: response.insertId,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res);
		}
	},

	findForPolice: async (
		req: Request<any, any, any, GetPoliceAccessesPayload>,
		res: Response<GetPoliceAccessesResponse>
	) => {
		const jwtPayload = req.jwt_payload as PoliceJwtPayload;

		try {
			res.json({
				status: 'success',
				data: await paginate<IAccess>(
					{
						filter: [
							...convertAccessFilter(req.query.filter),
							{
								police_nid: jwtPayload.nid,
							},
						],
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						next: req.query.next,
					},
					'Access',
					'access_id',
					undefined,
					{
						criminal_id: 'case_no',
						case_no: 'criminal_id',
					}
				),
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
		try {
			res.json({
				status: 'success',
				data: await paginate<IAccessPopulated>(
					{
						filter: convertAccessFilter(req.query.filter),
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						select: [
							...getPoliceAttributes('Police', ['password']),
							...getAccessAttributes('Access'),
							...getCasefileAttributes('Casefile'),
							...getCriminalAttributes('Criminal'),
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
						}),
					{
						criminal_id: 'case_no',
						case_no: 'criminal_id',
					}
				),
			});
		} catch (err) {
			logger.error(err);
			handleError(res);
		}
	},

	async update(
		req: Request<{ access_id: number }, any, UpdateAccessPayload>,
		res: Response<ApiResponse<UpdateAccessResponse>>
	) {
		try {
			const accessId = req.params.access_id;
			const jwtPayload = req.jwt_payload as AdminJwtPayload;
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
						admin_id: jwtPayload.id,
					}
				);
				res.json({
					status: 'success',
					data: {
						...access,
						...payload,
						admin_id: jwtPayload.id,
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
