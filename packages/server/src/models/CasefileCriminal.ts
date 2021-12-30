import { ICasefileCriminal } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { generateInsertQuery } from '../utils';
import { useQuery } from './utils/useQuery';

const CasefileCriminalModel = {
	async create(casefileCriminalData: ICasefileCriminal, connection?: PoolConnection) {
		const casefileCriminal: ICasefileCriminal = {
			case_no: casefileCriminalData.case_no,
			criminal_id: casefileCriminalData.criminal_id,
		};
		await useQuery(generateInsertQuery(casefileCriminal, 'Casefile_Criminal'), connection);
		return casefileCriminal;
	},
};

export default CasefileCriminalModel;
