/* eslint-disable camelcase */

import { DeleteCriminalPayload, ICriminal, UpdateCriminalPayload } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { SqlClause } from '../types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const CriminalModel = {
	find(sqlClause: SqlClause) {
		return find<ICriminal>(
			{
				...sqlClause,
				select: ['criminal_id', 'name', 'photo', ...(sqlClause.select ?? [])],
			},
			'Criminal'
		);
	},

	async create(criminalData: ICriminal, connection?: PoolConnection) {
		const criminal: ICriminal = {
			criminal_id: criminalData.criminal_id,
			name: criminalData.name,
			photo: criminalData.photo ?? null,
		};

		await useQuery(generateInsertQuery(criminal, 'Criminal'), connection);
		return criminal;
	},

	findByCriminalID(criminal_id: number) {
		return find<ICriminal>(
			{
				filter: { criminal_id },
			},
			'Criminal'
		);
	},

	async update(filterQuery: Partial<ICriminal>, payload: UpdateCriminalPayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Criminal'));
			// return the payload if the update operation was successful
			return payload as Partial<ICriminal>;
		} else {
			return null;
		}
	},

	async delete(payload: DeleteCriminalPayload) {
		await query(generateDeleteQuery(payload, 'Criminal'));
		return payload;
	},
};

export default CriminalModel;
