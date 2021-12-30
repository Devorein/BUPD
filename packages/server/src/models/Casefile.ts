/* eslint-disable camelcase */
import {
	DeleteCasefilePayload,
	ICasefile,
	UpdateCasefilePayload,
	WhereClauseQuery,
} from '@bupd/types';
import { generateDeleteQuery, generateUpdateQuery, query } from '../utils';
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

	findByCaseNo(case_no: number) {
		return find<ICasefile>(
			{
				filter: { case_no },
			},
			'Casefile'
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
	async delete(payload: DeleteCasefilePayload) {
		await query(generateDeleteQuery(payload, 'Casefile'));
		return payload;
	},
};

export default CasefileModel;
