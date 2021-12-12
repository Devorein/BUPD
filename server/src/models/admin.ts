import { IAdmin } from '../types';
import query from '../utils/query';

const AdminModel = {
	async findByEmail(email: string) {
		const queryResponse = (await query(`
      SELECT * FROM police where email = "${email}";
    `)) as Array<IAdmin & { password: string }>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return {
				email: queryResponse[0].email,
				id: queryResponse[0].id,
				password: queryResponse[0].password,
			};
		}
	},
};

export default AdminModel;
