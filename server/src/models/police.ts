import {
	GetPolicesPayload,
	IPolice,
	RegisterPolicePayload,
	UpdatePolicePayload,
	WhereClauseQuery,
} from '../types';
import { generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(generateInsertQuery(payload, 'police'));
		// If the insert was successful, the newly added record will be the same as the payload
		return payload;
	},

	find(whereClauseQuery: Partial<GetPolicesPayload>) {
		return find<WhereClauseQuery, IPolice>(
			{
				...whereClauseQuery,
				select: ['email', 'phone', 'address', 'designation', '`rank`', 'name', 'nid'],
			},
			'police'
		);
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
