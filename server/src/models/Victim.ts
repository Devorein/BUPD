import { IVictim } from '../shared.types';
import { generateInsertQuery } from '../utils/generateQueries';
import query from '../utils/query';

const VictimController = {
	async create(payload: IVictim): Promise<IVictim> {
		await query(generateInsertQuery<IVictim>(payload, 'Victim'));
		return payload;
	},
};

export default VictimController;
