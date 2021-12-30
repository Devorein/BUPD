import { IVictim } from '@bupd/types';
import { generateInsertQuery } from '../utils/generateQueries';
import pool from '../utils/pool';

const VictimController = {
	async create(payload: IVictim): Promise<IVictim> {
		const connection = await pool.getConnection();
		await connection.query(generateInsertQuery<IVictim>(payload, 'Victim'));
		connection.release();
		return payload;
	},
};

export default VictimController;
