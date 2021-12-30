/* eslint-disable camelcase */
import {
	DeleteCriminalPayload,
	ICriminal,
	UpdateCriminalPayload,
	WhereClauseQuery,
} from '@bupd/types';
import { generateDeleteQuery, generateUpdateQuery, query } from '../utils';
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
