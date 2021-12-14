import { ICriminal } from '../shared.types';
import { generateInsertQuery, generateSelectQuery, query, transformCriminalData } from '../utils';

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
	async find(filterQuery: Partial<ICriminal>) {
		const queryResponse = (await query(
			generateSelectQuery(filterQuery, 'criminal')
		)) as Array<ICriminal>;
		if (queryResponse.length === 0) {
			return null;
		} else {
			return queryResponse.map(transformCriminalData);
		}
	},
};

export default CriminalController;
