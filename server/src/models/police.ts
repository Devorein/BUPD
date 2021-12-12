import { IPolice, RegisterPolicePayload } from '../types';
import { query } from '../utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(`
      INSERT INTO police(nid, name, password, email) VALUES(${payload.nid}, "${payload.name}", "${payload.password}", "${payload.email}");
    `);
		const police: IPolice = {
			email: payload.email,
			name: payload.name,
			nid: payload.nid,
		};
		return police;
	},
};

export default PoliceModel;
