import { IAdmin } from '../types';
import { generateSelectQuery, transformAdminData } from '../utils';
import query from '../utils/query';

const AdminModel = {
	async find(filterQuery: Partial<IAdmin>) {
		const queryResponse = (await query(generateSelectQuery(filterQuery, 'admin'))) as Array<
			IAdmin & { password: string }
		>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return queryResponse.map(transformAdminData);
		}
	},
};

export default AdminModel;
