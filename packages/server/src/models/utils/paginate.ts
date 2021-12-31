import { NextQuery, PaginatedResponse } from '@bupd/types';
import { RowDataPacket } from 'mysql2';
import { SqlClause } from '../../types';
import { generateCountQuery, generatePaginationQuery, query } from '../../utils';
import find from './find';

export async function paginate<Data>(
	sqlClause: SqlClause & { next?: NextQuery },
	table: string,
	nextCursorProperty: keyof Data
) {
	// Generate the total counts first as sqlClause.filter will be mutated by generatePaginationQuery
	const rowsCount = (await query(
		generateCountQuery(sqlClause.filter ?? {}, table)
	)) as RowDataPacket[];
	const rows = await find<Data>(
		generatePaginationQuery(sqlClause, nextCursorProperty as string),
		table
	);

	let next: PaginatedResponse<any>['next'] = null;
	// Get the last row
	const lastRow = rows[rows.length - 1];
	if (lastRow) {
		// IF the last row exists, then we need to set its id as next.id
		next = {
			id: lastRow[nextCursorProperty] as unknown as number,
		};
	}

	return {
		total: rowsCount[0][0]?.count,
		items: rows,
		next,
	} as PaginatedResponse<Data>;
}
