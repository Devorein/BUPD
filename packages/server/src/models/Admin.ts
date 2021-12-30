import { IAdmin } from '@bupd/types';
import { find } from './utils';

const AdminModel = {
	find(filterQuery: Partial<IAdmin>) {
		return find<IAdmin & { password: string }>({ filter: filterQuery }, 'Admin');
	},
};

export default AdminModel;
