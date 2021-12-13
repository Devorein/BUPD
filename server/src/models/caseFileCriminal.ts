import { ICaseFileCriminal } from '../shared.types';
import { generateInsertQuery, query } from '../utils';

const CaseFileCriminalModel = {
	async create(payload: ICaseFileCriminal) {
		await query(generateInsertQuery(payload, 'case_criminal'));
	},
};

export default CaseFileCriminalModel;
