import { IVictim } from '../shared.types';
import { generateInsertQuery } from '../utils/generateQueries';
import { normalizeVictim } from '../utils/normalize';
import query from '../utils/query';

const VictimController = {
	async create(payload: IVictim): Promise<IVictim> {
		await query(generateInsertQuery<IVictim>(payload, 'victim'));
		return normalizeVictim(payload);
	},
};

export default VictimController;
