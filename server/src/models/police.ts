import { IPolice, RegisterPolicePayload, UpdatePolicePayload } from '../types';
import {
	generateInsertQuery,
	generateSelectQuery,
	generateUpdateQuery,
	normalizePolice,
	query,
} from '../utils';

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
			return queryResponse.map(normalizePolice);
		}
	},

	async update(filterQuery: Partial<IPolice>, payload: UpdatePolicePayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'police'));
			// return the payload if the update operation was successful
			return payload as Partial<IPolice>;
		} else {
			return null;
		}
	},
};

export default PoliceModel;
