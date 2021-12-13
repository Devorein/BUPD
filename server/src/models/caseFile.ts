import { CreateCasePayload, ICaseFile } from '../shared.types';
import { generateInsertQuery, normalizeCaseFile, query, removeFields } from '../utils';

const CaseFileModel = {
	async create(payload: CreateCasePayload & { police_nid: number }): Promise<ICaseFile | null> {
		try {
			const caseFilePayload: ICaseFile = {
				...removeFields<CreateCasePayload, ICaseFile>(payload, [
					'crime_categories',
					'criminals',
					'weapons',
					'crime_time',
					'victims',
				]),
				status: 'open',
				case_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
				crime_time: new Date(payload.crime_time).toISOString().slice(0, 19).replace('T', ' '),
			};
			const insertQueryResponse = (await query(
				generateInsertQuery(caseFilePayload, 'case_file')
			)) as { insertId: number };

			if (!insertQueryResponse) {
				throw new Error("Couldn't insert case file");
			} else {
				return normalizeCaseFile({ ...caseFilePayload, case_number: insertQueryResponse.insertId });
			}
		} catch (_) {
			throw new Error("Couldn't create case file");
		}
	},
};

export default CaseFileModel;
