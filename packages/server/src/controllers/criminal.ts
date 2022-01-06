import {
	ApiResponse,
	DeleteCriminalResponse,
	GetCriminalsPayload,
	GetCriminalsResponse,
	ICriminalPopulated,
	UpdateCriminalPayload,
	UpdateCriminalResponse,
} from '@bupd/types';
import { Request, Response } from 'express';
import { CriminalModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { handleError, logger } from '../utils';
import { convertCriminalFilter } from '../utils/convertClientQuery';
import { getCriminalAttributes } from '../utils/generateAttributes';
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
		try {
			res.json({
				status: 'success',
				data: await paginate<ICriminalPopulated>(
					{
						filter: convertCriminalFilter(req.query.filter),
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						next: req.query.next,
						select: [
							...getCriminalAttributes('Criminal'),
							{
								aggregation: ['COUNT'],
								attribute: `criminal_id`,
								alias: 'total_cases',
								namespace: 'Criminal',
							},
						],
						joins: [['Criminal', 'Casefile_Criminal', 'criminal_id', 'criminal_id']],
						groups: ['Criminal.criminal_id'],
					},
					'Criminal',
					'criminal_id',
					(rows) =>
						rows.map((row) => {
							const inflatedObject = inflateObject<ICriminalPopulated>(row, 'Criminal');
							return {
								...inflatedObject,
								total_cases: row.total_cases,
							};
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
