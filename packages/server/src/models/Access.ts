import { IAccess, UpdateAccessPayload, WhereClauseQuery } from '@bupd/types';
import { generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const AccessModel = {
	find(whereClauseQuery: WhereClauseQuery) {
		return find<IAccess>(whereClauseQuery, 'access');
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
