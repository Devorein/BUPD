import { generateSelectQuery, query } from '../../utils';

export default async function find<WhereClauseQuery, Row>(
	whereClauseQuery: Partial<WhereClauseQuery>,
	table: string
) {
	return (await query(generateSelectQuery(whereClauseQuery, table))) as Array<Row>;
}
