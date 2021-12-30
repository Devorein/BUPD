import pool from './pool';

export default async function query(sqlString: string) {
	const connection = await pool.getConnection();
	const response = await connection.query(sqlString);
	connection.release();
	return response;
}
