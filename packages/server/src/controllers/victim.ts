import {
	ApiResponse,
	DeleteVictimPayload,
	DeleteVictimResponse,
	GetVictimsPayload,
	GetVictimsResponse,
	IVictim,
	UpdateVictimPayload,
} from '@bupd/types';
import { UpdateVictimResponse } from '@bupd/types/src/endpoints';
import { Request, Response } from 'express';
import { VictimModel } from '../models';
import { paginate } from '../models/utils/paginate';
import { handleError, removeFields } from '../utils';
import { convertVictimFilter } from '../utils/convertClientQuery';
import Logger from '../utils/logger';

const VictimController = {
	async findMany(
		req: Request<any, any, any, GetVictimsPayload>,
		res: Response<GetVictimsResponse>
	) {
		try {
			res.json({
				status: 'success',
				data: await paginate<IVictim>(
					{
						filter: convertVictimFilter(req.query.filter),
						limit: req.query.limit,
						sort: req.query.sort ? [req.query.sort] : [],
						next: req.query.next,
					},
					'Victim',
					'name'
				),
			});
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async delete(req: Request<any, any, DeleteVictimPayload>, res: Response<DeleteVictimResponse>) {
		try {
			const [victim] = await VictimModel.find(req.body.name, req.body.case_no);
			if (victim) {
				const result = await VictimModel.delete(req.body.name, req.body.case_no);
				if (result) {
					res.json({
						status: 'success',
						data: victim,
					});
				}
			} else {
				handleError(res, 404, "Victim doesn't exist");
			}
		} catch (err) {
			Logger.error(err);
			handleError(res);
		}
	},
	async update(
		req: Request<any, any, UpdateVictimPayload>,
		res: Response<ApiResponse<UpdateVictimResponse>>
	) {
		try {
			const payload = req.body;
			const [victim] = await VictimModel.find(payload.old_name, payload.case_no);
			if (!victim) {
				handleError(res, 404, `Victim not found`);
			} else {
				const updatedData = await VictimModel.update(
					[
						{
							name: payload.old_name,
							case_no: payload.case_no,
						},
					],
					removeFields(payload, ['case_no', 'old_name'])
				);

				res.json({
					status: 'success',
					data: removeFields(updatedData, ['old_name']),
				});
			}
		} catch (err) {
			Logger.error(err);
			handleError(res, 500, "Couldn't update victim");
		}
	},
};

export default VictimController;
