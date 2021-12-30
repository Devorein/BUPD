import { WhereClauseQuery } from '@bupd/types';
import { generateSelectQuery, pool } from '../../utils';

export default async function find<Row>(
	whereClauseQuery: Partial<WhereClauseQuery>,
	table: string
) {
	const connection = await pool.getConnection();
	const response = await connection.query(generateSelectQuery(whereClauseQuery, table));
	connection.release();
	return response[0] as Array<Row>;
}
