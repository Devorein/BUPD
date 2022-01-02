import { IAccess, NextKey, UpdateAccessPayload } from '@bupd/types';
import { SqlClause, SqlFilter } from '../types';
import { generatePaginationQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const AccessModel = {
	find(sqlClause: SqlClause & { next?: NextKey }) {
		return find<IAccess>(generatePaginationQuery(sqlClause, 'access_id'), 'access');
	},
	async update(filterQuery: SqlFilter, payload: UpdateAccessPayload & { admin_id: number }) {
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Access'));
			return payload as Partial<IAccess>;
		} else {
			return null;
		}
	},
};
export default AccessModel;
