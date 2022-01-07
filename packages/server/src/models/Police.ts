import { IPolice, RegisterPolicePayload } from '@bupd/types';
import { SqlClause, SqlFilter } from '../types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { getPoliceAttributes } from '../utils/generateAttributes';
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
				select: [...getPoliceAttributes(), ...(sqlClause.select ?? [])],
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

	async update(filterQuery: SqlFilter, payload: Partial<IPolice>) {
		await query(generateUpdateQuery(filterQuery, payload, 'Police'));
		// return the payload if the update operation was successful
		return payload as Partial<IPolice>;
	},

	async delete(nid: number) {
		await query(generateDeleteQuery([{ nid }], 'Police'));
		return true;
	},
};

export default PoliceModel;
