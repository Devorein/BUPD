import { NextKey, PaginatedResponse } from '@bupd/types';
import { RowDataPacket } from 'mysql2';
import { SqlClause } from '../../types';
import { generateCountQuery, generatePaginationQuery, query } from '../../utils';
import find from './find';

export async function paginate<Data>(
	sqlClause: SqlClause & { next?: NextKey },
	table: string,
	nextCursorProperty: keyof Data,
	// eslint-disable-next-line
	rowTransform?: (rows: Data[]) => Data[],
	nullableSortFields?: Record<string, string>
) {
	const sortField = sqlClause.sort?.[0]?.[0];

	let next: PaginatedResponse<any>['next'] = null;

	// Generate the total counts first as sqlClause.filter will be mutated by generatePaginationQuery
	const rowsCount = (await query(
		generateCountQuery(sqlClause.filter ?? [], table)
	)) as RowDataPacket[];
	const paginationQuery = generatePaginationQuery(
		sqlClause,
		nextCursorProperty as string,
		nullableSortFields as Record<string, string>
	);

	let rows = await find<Data>(paginationQuery, table);

	if (rowTransform) {
		rows = rowTransform(rows);
	}

	// Get the last row
	const lastRow = rows[rows.length - 1];
	if (lastRow) {
		// If the last row exists, then we need to set its id as next.id
		next = {
			id: lastRow[nextCursorProperty] as unknown as number,
		};

		if (sortField) {
			const secondarySortField = nullableSortFields?.[sortField as string];
			const isLastRowPrimarySortNull = lastRow[sortField as keyof Data] === null;
			if (isLastRowPrimarySortNull && secondarySortField) {
				next[secondarySortField] = lastRow[secondarySortField as keyof Data];
			}
			next[sortField] = lastRow[sortField as keyof Data];
		}
	}

	return {
		total: rowsCount[0][0]?.count,
		items: rows,
		next,
	} as PaginatedResponse<Data>;
}
