import { ICasefileCriminal } from '../shared.types';
import { generateInsertQuery, query } from '../utils';

const CasefileCriminalModel = {
	async create(payload: ICasefileCriminal) {
		await query(generateInsertQuery(payload, 'case_criminal'));
	},
};

export default CasefileCriminalModel;