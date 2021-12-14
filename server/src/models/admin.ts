import { IAdmin } from '../types';
import { find } from './utils';

const AdminModel = {
	find(filterQuery: Partial<IAdmin>) {
		return find<IAdmin, IAdmin & { password: string }>(filterQuery, 'admin');
	},
};

export default AdminModel;
