import { IPolice, RegisterPolicePayload, UpdatePolicePayload } from '../types';
import { normalizePolice, query } from '../utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		// Storing all the fields and their corresponding values in array
		// So that we can concat them for later
		const entries = Object.entries(payload);
		const fields: string[] = [],
			values: (string | number)[] = [];
		entries.forEach(([field, value]) => {
			fields.push(field === 'rank' ? `\`${field}\`` : field);
			values.push(value);
		});
		// Passing the values array as the 2nd argument to auto escape them
		// To prevent SQL injection
		await query(
			`
      INSERT INTO police(${fields.join(',')}) VALUES(${entries.map(() => '?').join(',')});
    `,
			values
		);
		// If the insert was successful, the newly added record will be the same as the payload
		return payload;
	},

	async findByEmail(email: string) {
		const queryResponse = (await query(`
      SELECT * FROM police where email = "${email}";
    `)) as Array<IPolice & { password: string }>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return normalizePolice(queryResponse[0]);
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
					.join(',')} where nid = ${nid} and email = "${email}";
      `);
			// return the payload if the update operation was successful
			return payload as IPolice;
		} else {
			return null;
		}
	},
};

export default PoliceModel;
