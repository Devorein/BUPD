import { WhereClauseQuery } from '../../shared.types';
import { generateSelectQuery, query } from '../../utils';

export default async function find<Row>(
	whereClauseQuery: Partial<WhereClauseQuery>,
	table: string
) {
	return (await query(generateSelectQuery(whereClauseQuery, table))) as Array<Row>;
}
