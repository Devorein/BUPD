import {
	DeletePolicePayload,
	IPolice,
	RegisterPolicePayload,
	UpdatePolicePayload,
	WhereClauseQuery,
} from '@bupd/types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(generateInsertQuery(payload, 'Police'));
		// If the insert was successful, the newly added record will be the same as the payload
		return payload;
	},

	find(whereClauseQuery: WhereClauseQuery) {
		return find<IPolice>(
			{
				...whereClauseQuery,
				select: [
					'email',
					'phone',
					'address',
					'designation',
					'rank',
					'name',
					'nid',
					...(whereClauseQuery.select ?? []),
				],
			},
			'Police'
		);
	},

	findByNid(nid: number) {
		return find<IPolice>(
			{
				filter: { nid },
			},
			'Police'
		);
	},

	async update(filterQuery: Partial<IPolice>, payload: UpdatePolicePayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Police'));
			// return the payload if the update operation was successful
			return payload as Partial<IPolice>;
		} else {
			return null;
		}
	},

	async delete(payload: DeletePolicePayload) {
		await query(generateDeleteQuery(payload, 'Police'));
		return payload;
	},
};

export default PoliceModel;
