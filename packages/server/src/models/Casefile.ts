/* eslint-disable camelcase */
import { ICasefile, TCasefileStatus, UpdateCasefilePayload } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { SqlClause, SqlFilter } from '../types';
import { generateDeleteQuery, generateInsertQuery, generateUpdateQuery, query } from '../utils';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const CasefileModel = {
	find(sqlClause: SqlClause) {
		return find<ICasefile>(
			{
				...sqlClause,
				select: [
					'time',
					'priority',
					'status',
					'location',
					'case_no',
					'police_nid',
					...(sqlClause.select ?? []),
				],
			},
			'CaseFile'
		);
	},

	findByCaseNo(case_no: number) {
		return find<ICasefile>(
			{
				filter: [{ case_no }],
			},
			'Casefile'
		);
	},

	async create(
		casefileData: Omit<ICasefile, 'time' | 'status'> & {
			time: number;
			status?: TCasefileStatus | null;
		},
		connection?: PoolConnection
	) {
		const casefile: ICasefile = {
			case_no: casefileData.case_no,
			time: new Date(casefileData.time).toISOString().slice(0, 19).replace('T', ' '),
			status: casefileData.status ?? 'open',
			priority: casefileData.priority,
			location: casefileData.location,
			police_nid: casefileData.police_nid,
		};
		await useQuery(generateInsertQuery(casefile, 'Casefile'), connection);
		return casefile;
	},

	async update(filterQuery: SqlFilter, payload: UpdateCasefilePayload) {
		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(generateUpdateQuery(filterQuery, payload, 'Casefile'));
			// return the payload if the update operation was successful
			return payload as Partial<ICasefile>;
		} else {
			return null;
		}
	},
	async delete(case_no: number) {
		await query(generateDeleteQuery([{ case_no }], 'Casefile'));
		return true;
	},
};

export default CasefileModel;
