import { SqlClause } from '../../types';
import { generateSelectQuery, pool } from '../../utils';

export default async function find<Row>(sqlClause: Partial<SqlClause>, table: string) {
	const connection = await pool.getConnection();
	const response = await connection.query(generateSelectQuery(sqlClause, table));
	connection.release();
	return response[0] as Array<Row>;
}
