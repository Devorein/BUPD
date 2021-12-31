import {
	DeletePolicePayload,
	IPolice,
	RegisterPolicePayload,
	UpdatePolicePayload,
} from '@bupd/types';
import { SqlClause } from '../types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';

const PoliceModel = {
	async create(payload: RegisterPolicePayload) {
		await query(generateInsertQuery(payload, 'Police'));
		// If the insert was successful, the newly added record will be the same as the payload
		return payload;
	},

	find(sqlClause: SqlClause) {
		return find<IPolice>(
			{
				...sqlClause,
				select: [
					'email',
					'phone',
					'address',
					'designation',
					'rank',
					'name',
					'nid',
					...(sqlClause.select ?? []),
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
