import { IAccess, UpdateAccessPayload } from '@bupd/types';
import { SqlClause } from '../types';
import { generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const AccessModel = {
	find(sqlClause: SqlClause) {
		return find<IAccess>(sqlClause, 'access');
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
