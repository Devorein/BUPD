import {
	ApiResponse,
	DeleteCriminalResponse,
	GetCriminalsPayload,
	GetCriminalsResponse,
	ICriminalIntermediate,
	ICriminalPopulated,
	PoliceJwtPayload,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { CriminalModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { SqlSelect } from '../types';
import { handleError, logger } from '../utils';
import { convertCriminalFilter } from '../utils/convertClientQuery';
import { getCriminalAttributes } from '../utils/generateAttributes';
import { generatePermissionRecord } from '../utils/generatePermissionRecord';
import { inflateObject } from '../utils/inflateObject';
import Logger from '../utils/logger';

const CriminalController = {
	async update(
		req: Request<{ criminal_id: number }, any, UpdateCriminalPayload>,
		res: Response<ApiResponse<UpdateCriminalResponse>>
	) {
		try {
			const criminalId = req.params.criminal_id;
			const payload = req.body;
			const [criminal] = await CriminalModel.find({ filter: [{ criminal_id: criminalId }] });
			if (!criminal) {
				handleError(res, 404, "Criminal doesn't exist");
			} else {
				await CriminalModel.update(
					[
						{
							criminal_id: criminalId,
						},
					],
					payload
				);
				res.json({
					status: 'success',
					data: {
						...criminal,
						...payload,
					},
				});
			}
		} catch (err) {
			logger.error(err);
			handleError(res, 500, "Couldn't update the criminal");
		}
	},
	async delete(
		req: Request<{ criminal_id: number }, any, undefined>,
		res: Response<DeleteCriminalResponse>
	) {
		try {
			const criminal = await CriminalModel.findByCriminalID(req.params.criminal_id);
			if (criminal[0]) {
				const result = await CriminalModel.delete(req.params.criminal_id);
				if (result) {
					res.json({
						status: 'success',
						data: criminal[0],
					});
				}
			} else {
				handleError(res, 404, "Criminal doesn't exist");
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async findMany(
		req: Request<any, any, any, GetCriminalsPayload>,
		res: Response<GetCriminalsResponse>
	) {
		const select: SqlSelect = [];

		if (req.jwt_payload!.type === 'police') {
			select.push({
				raw: `(SELECT GROUP_CONCAT(CONCAT(permission, " ", approved)) from Access where Access.criminal_id = Criminal.\`criminal_id\` AND police_nid = ${
					(req.jwt_payload as PoliceJwtPayload).nid
				}) as permissions`,
			});
		}

		select.push(...getCriminalAttributes('Criminal'), {
			aggregation: ['COUNT'],
			attribute: `criminal_id`,
			alias: 'total_cases',
			namespace: 'Criminal',
		});

		try {
			res.json({
				status: 'success',
				data: await paginate<ICriminalPopulated, ICriminalIntermediate>(
					{
						filter: convertCriminalFilter(req.query.filter),
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						next: req.query.next,
						select,
						joins: [['Criminal', 'Casefile_Criminal', 'criminal_id', 'criminal_id']],
						groups: ['Criminal.criminal_id'],
					},
					'Criminal',
					'criminal_id',
					(rows) =>
						rows.map((row) => {
							const { permissions } = row;
							const inflatedObject = inflateObject<ICriminalIntermediate>(row, 'Criminal');

							return {
								criminal_id: inflatedObject.criminal_id,
								name: inflatedObject.name,
								photo: inflatedObject.photo,
								total_cases: row.total_cases,
								permissions: permissions ? generatePermissionRecord(permissions) : undefined,
							} as ICriminalPopulated;
						})
				),
			});
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
};

export default CriminalController;
