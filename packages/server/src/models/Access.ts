import { IAccess, NextQuery, UpdateAccessPayload } from '@bupd/types';
import { SqlClause, SqlFilter } from '../types';
import { generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const AccessModel = {
	find(sqlClause: SqlClause & { next?: NextQuery }) {
		const filter: SqlFilter = {};
		if (sqlClause.next) {
			const sortOrder = sqlClause.sort ? sqlClause.sort[1] : 1;
			filter.access_id = [sortOrder === -1 ? '>' : '<', sqlClause.next.id];
		}

		return find<IAccess>(
			{
				...sqlClause,
				filter: {
					...(sqlClause.filter ?? {}),
					...filter,
				},
			},
			'access'
		);
	},
	async update(filterQuery: Partial<IAccess>, payload: UpdateAccessPayload) {
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Access'));
			return payload as Partial<IAccess>;
		} else {
			return null;
		}
	},
};
export default AccessModel;
