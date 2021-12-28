/* eslint-disable camelcase */
import { generateUpdateQuery, query } from '../utils';
import { ICriminal, UpdateCriminalPayload, WhereClauseQuery } from '../shared.types';
import { find } from './utils';

const CriminalModel = {
	find(whereClauseQuery: WhereClauseQuery) {
		return find<ICriminal>(
			{
				...whereClauseQuery,
				select: ['criminal_id', 'name', 'photo', ...(whereClauseQuery.select ?? [])],
			},
			'Criminal'
		);
	},

	findByCaseNo(criminal_id: number) {
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
};

export default CriminalModel;
