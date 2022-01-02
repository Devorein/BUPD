import { SqlClause } from '../../types';
import { generateSelectQuery, pool } from '../../utils';
import Logger from '../../utils/logger';

export default async function find<Row>(sqlClause: Partial<SqlClause>, table: string) {
	const connection = await pool.getConnection();
	const selectQuery = generateSelectQuery(sqlClause, table);
	Logger.info(selectQuery);
	const response = await connection.query(selectQuery);
	connection.release();
	return response[0] as Array<Row>;
}
