import { IAccess, WhereClauseQuery } from '../types';
import { find } from './utils';

const AccessModel = {
	find(whereClauseQuery: WhereClauseQuery) {
		return find<IAccess>(whereClauseQuery, 'access');
	},
};
export default AccessModel;
