import { PoolConnection } from 'mysql2/promise';
import Logger from './logger';
import pool from './pool';

export default async function query(sqlString: string, connection?: PoolConnection) {
	const conn = connection ?? (await pool.getConnection());
	Logger.info(sqlString);
	const response = await conn.query(sqlString);
	conn.release();
	return response;
}
