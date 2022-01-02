import { IPolice, RegisterPolicePayload, UpdatePolicePayload } from '@bupd/types';
import { SqlClause, SqlFilter } from '../types';
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

	async findByNid(nid: number) {
		const polices = await find<IPolice>(
			{
				filter: [{ nid }],
			},
			'Police'
		);
		return polices[0];
	},

	async update(filterQuery: SqlFilter, payload: UpdatePolicePayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Police'));
			// return the payload if the update operation was successful
			return payload as Partial<IPolice>;
		} else {
			return null;
		}
	},

	async delete(nid: number) {
		await query(generateDeleteQuery([{ nid }], 'Police'));
		return true;
	},
};

export default PoliceModel;
