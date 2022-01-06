import { IAccess, NextKey, UpdateAccessPayload } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { SqlClause, SqlFilter } from '../types';
import { generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { generatePaginationQuery } from '../utils/generatePaginationQuery';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const AccessModel = {
	find(sqlClause: SqlClause & { next?: NextKey }) {
		return find<IAccess>(generatePaginationQuery(sqlClause, 'access_id'), 'Access');
	},
	async update(filterQuery: SqlFilter, payload: UpdateAccessPayload & { admin_id: number }) {
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Access'));
			return payload as Partial<IAccess>;
		} else {
			return null;
		}
	},
	async create(accessData: Omit<IAccess, 'access_id'>, connection?: PoolConnection) {
		await useQuery(generateInsertQuery(accessData, 'Access'), connection);
		return accessData;
	},
};
export default AccessModel;
