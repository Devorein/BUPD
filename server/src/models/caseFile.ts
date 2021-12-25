import { CreateCasePayload, ICasefile } from '../shared.types';
import { generateInsertQuery, query, removeFields } from '../utils';

const CasefileModel = {
	async create(payload: CreateCasePayload & { police_nid: number }): Promise<ICasefile | null> {
		try {
			const caseFilePayload: ICasefile = {
				...removeFields<CreateCasePayload, ICasefile>(payload, [
					'crime_categories',
					'criminals',
					'weapons',
					'crime_time',
					'victims',
				]),
				status: 'open',
				time: new Date(payload.crime_time).toISOString().slice(0, 19).replace('T', ' '),
			};
			const insertQueryResponse = (await query(
				generateInsertQuery(caseFilePayload, 'case_file')
			)) as { insertId: number };

			if (!insertQueryResponse) {
				throw new Error("Couldn't insert case file");
			} else {
				return {
					...caseFilePayload,
					case_no: insertQueryResponse.insertId,
				};
			}
		} catch (_) {
			throw new Error("Couldn't create case file");
		}
	},
};

export default CasefileModel;
