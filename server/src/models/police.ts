import { IPolice, RegisterPolicePayload, UpdatePolicePayload } from '../types';
import { generateInsertQuery, generateSelectQuery, normalizePolice, query } from '../utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(generateInsertQuery(payload, 'police'));
		// If the insert was successful, the newly added record will be the same as the payload
		return payload;
	},

	async find(filterQuery: Partial<IPolice>) {
		const queryResponse = (await query(generateSelectQuery(filterQuery, 'police'))) as Array<
			IPolice & { password: string }
		>;
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
