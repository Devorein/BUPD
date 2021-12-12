import { IPolice, RegisterPolicePayload, UpdatePolicePayload } from '../types';
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

	async findByEmail(email: string) {
		const queryResponse = (await query(`
      SELECT * FROM police where email = "${email}";
    `)) as Array<IPolice & { password: string }>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return {
				email: queryResponse[0].email,
				name: queryResponse[0].name,
				nid: queryResponse[0].nid,
				password: queryResponse[0].password,
			};
		}
	},

	async update(nid: number, email: string, payload: UpdatePolicePayload) {
		const updateTuples: Array<[keyof UpdatePolicePayload, any]> = [];
		if (payload.email) {
			updateTuples.push(['email', `"${payload.email}"`]);
		}

		if (payload.name) {
			updateTuples.push(['name', `"${payload.name}"`]);
		}

		if (payload.nid) {
			updateTuples.push(['nid', payload.nid]);
		}
		if (updateTuples.length !== 0) {
			await query(`
        UPDATE police SET ${updateTuples
					.map((updateTuple) => updateTuple.join('='))
					.join(',')} where nid = ${nid} & email = "${email}";
      `);
			return payload as IPolice;
		} else {
			return null;
		}
	},
};

export default PoliceModel;
