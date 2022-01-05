import { IVictim, UpdateVictimPayload } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { SqlFilter } from '../types';
import { query } from '../utils';
import {
	generateDeleteQuery,
	generateInsertQuery,
	generateUpdateQuery,
} from '../utils/generateQueries';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const VictimModel = {
	async create(
		victimData: Partial<IVictim> & { case_no: number; name: string },
		connection?: PoolConnection
	) {
		const victim: IVictim = {
			name: victimData.name,
			age: victimData.age ?? null,
			address: victimData.address ?? null,
			phone_no: victimData.phone_no ?? null,
			description: victimData.description ?? null,
			case_no: victimData.case_no,
		};

		await useQuery(generateInsertQuery<IVictim>(victim, 'Victim'), connection);
		return victim;
	},
	async find(name: string, case_no: number) {
		return find<IVictim>(
			{
				filter: [
					{
						name,
						case_no,
					},
				],
			},
			'Victim'
		);
	},
	async delete(name: string, case_no: number) {
		await query(generateDeleteQuery([{ name, case_no }], 'Victim'));
		return true;
	},

	async update(filterQuery: SqlFilter, payload: UpdateVictimPayload) {
		await query(generateUpdateQuery(filterQuery, payload, 'Victim'));
		return payload;
	},
};

export default VictimModel;
