import { ICriminal } from '../shared.types';
import { generateInsertQuery, query } from '../utils';
import { find } from './utils';

const CriminalController = {
	async create(payload: { name: string; photo: string }): Promise<ICriminal> {
		const insertQueryResponse = (await query(
			generateInsertQuery(
				{
					name: payload.name,
					photo: payload.photo,
				},
				'Criminal'
			)
		)) as { insertId: number };
		return {
			...payload,
			id: insertQueryResponse.insertId,
		};
	},
	find(filterQuery: Partial<ICriminal>) {
		return find<ICriminal>({ filter: filterQuery }, 'Criminal');
	},
};

export default CriminalController;
