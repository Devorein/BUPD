import { IAdmin } from '../types';
import { normalizeAdmin } from '../utils';
import query from '../utils/query';

const AdminModel = {
	async findByEmail(email: string) {
		const queryResponse = (await query(`
      SELECT * FROM admin where email = "${email}";
    `)) as Array<IAdmin & { password: string }>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return normalizeAdmin(queryResponse[0]);
		}
	},
};

export default AdminModel;
