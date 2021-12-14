import { generateSelectQuery, query } from '../../utils';

export default async function find<FilterQuery, Row = FilterQuery>(
	filterQuery: Partial<FilterQuery>,
	table: string
) {
	return (await query(generateSelectQuery(filterQuery, table))) as Array<Row>;
}
