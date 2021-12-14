import { ICriminal } from '../shared.types';
import { generateInsertQuery, query, transformCriminalData } from '../utils';
import { find } from './utils';

const CriminalController = {
	async create(payload: { name: string; photo: string }): Promise<ICriminal> {
		const insertQueryResponse = (await query(
			generateInsertQuery(
				{
					name: payload.name,
					photo: payload.photo,
				},
				'criminal'
			)
		)) as { insertId: number };
		return transformCriminalData({
			...payload,
			id: insertQueryResponse.insertId,
		});
	},
	find(filterQuery: Partial<ICriminal>) {
		return find<ICriminal>(filterQuery, 'criminal');
	},
};

export default CriminalController;
