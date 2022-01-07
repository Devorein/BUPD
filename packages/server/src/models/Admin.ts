import { IAdmin } from '@bupd/types';
import { SqlFilter } from '../types';
import { find } from './utils';

const AdminModel = {
	find(filterQuery: SqlFilter) {
		return find<IAdmin & { password: string }>({ filter: filterQuery }, 'Admin');
	},
};

export default AdminModel;
