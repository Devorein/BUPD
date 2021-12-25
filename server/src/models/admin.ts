import { IAdmin } from '../types';
import { find } from './utils';

const AdminModel = {
	find(filterQuery: Partial<IAdmin>) {
		return find<IAdmin & { password: string }>({ filter: filterQuery }, 'admin');
	},
};

export default AdminModel;
