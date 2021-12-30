import { IVictim } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { generateInsertQuery } from '../utils/generateQueries';
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
};

export default VictimModel;
