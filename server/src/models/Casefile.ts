import { ICasefile, UpdateCasefilePayload, WhereClauseQuery } from '../types';
import { generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const CasefileModel = {
	find(whereClauseQuery: WhereClauseQuery) {
		return find<ICasefile>(
			{
				...whereClauseQuery,
				select: [
					'time',
					'priority',
					'status',
					'location',
					'case_no',
					'police_nid',
					...(whereClauseQuery.select ?? []),
				],
			},
			'CaseFile'
		);
	},
	async update(filterQuery: Partial<ICasefile>, payload: UpdateCasefilePayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Casefile'));
			// return the payload if the update operation was successful
			return payload as Partial<ICasefile>;
		} else {
			return null;
		}
	},
};

export default CasefileModel;
