import { IPolice, RegisterPolicePayload } from '../types';
import { query } from '../utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(`
      INSERT INTO police(nid, name, password) VALUES(${payload.nid}, "${payload.name}", "${payload.password}");
    `);
		const police: IPolice = {
			name: payload.name,
			nid: payload.nid,
		};
		return police;
	},
};

export default PoliceModel;
