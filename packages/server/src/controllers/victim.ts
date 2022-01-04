import { GetVictimsPayload, GetVictimsResponse, IVictim } from '@bupd/types';
import { Request, Response } from 'express';
import { paginate } from '../models/utils/paginate';
import { handleError } from '../utils';
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
};

export default VictimController;
