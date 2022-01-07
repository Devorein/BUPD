import { SqlClause } from '../../types';
import { generateSelectQuery, query } from '../../utils';

export default async function find<Row>(sqlClause: Partial<SqlClause>, table: string) {
	return (await query(generateSelectQuery(sqlClause, table)))[0] as Array<Row>;
}
