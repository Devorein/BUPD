import { NextKey } from '@bupd/types';
import { PrimitiveValues, SqlClause, SqlFilter, SqlFilterOperators, SqlFilterOr } from '../types';

export function generatePaginationQuery(
	sqlClause: SqlClause & { next?: NextKey },
	nextCursorProperty: string,
	nullableSortFields?: Record<string, string>
) {
	const filter: SqlFilter = [];
	const sortField = sqlClause.sort?.[0]?.[0];
	const sortOrder = sqlClause.sort?.[0]?.[1];
	const sortOperator = sqlClause.sort && sortOrder === -1 ? '$lt' : '$gt';

	if (sqlClause.next) {
		if (sortField && sortOrder) {
			const secondarySortField = nullableSortFields?.[sortField];
			const sortFieldValue = sqlClause.next[sortField];
			const filterOr: SqlFilterOr = {
				$or: [],
			};

			if (sortFieldValue !== null) {
				filterOr.$or.push(
					{
						[sortField]: {
							[sortOperator]: sortFieldValue,
						},
					} as Record<string, PrimitiveValues | SqlFilterOperators>,
					{
						[sortField]: {
							$eq: sqlClause.next[sortField],
						},
						[nextCursorProperty]: {
							[sortOperator]: sqlClause.next.id,
						},
					} as Record<string, PrimitiveValues | SqlFilterOperators>
				);

				// If the field might have null as a value and sort field value is next is not null
				if (secondarySortField) {
					filterOr.$or.push({
						[sortField]: {
							$is: null,
						},
					});
				}
				if (sqlClause.sort && secondarySortField) {
					sqlClause.sort.push([secondarySortField, sortOrder]);
				}
			} else if (secondarySortField) {
				// We have reached null for our cursor key, so use the secondary key as cursor
				// Use the tuples second value to sort the rest of the rows

				// Update the sort to use the secondary key as sort field
				// eslint-disable-next-line
				sqlClause!.sort![0][0] = secondarySortField;

				filter.push({
					[sortField]: {
						$is: null,
					},
				});

				filterOr.$or.push(
					{
						[secondarySortField]: {
							[sortOperator]: sqlClause.next[secondarySortField],
						},
					} as Record<string, PrimitiveValues | SqlFilterOperators>,
					{
						[secondarySortField]: {
							$eq: sqlClause.next[secondarySortField],
						},
						[nextCursorProperty]: {
							[sortOperator]: sqlClause.next.id,
						},
					} as Record<string, PrimitiveValues | SqlFilterOperators>
				);
			}

			filter.push(filterOr);
		} else {
			filter.push({
				[nextCursorProperty]: {
					$gt: sqlClause.next.id,
				},
			});
		}
	} else if (sortField && sortOrder) {
		const secondarySortField = nullableSortFields?.[sortField];
		if (sqlClause.sort && secondarySortField) {
			sqlClause.sort.push([secondarySortField, sortOrder]);
		}
	}

	const sort: SqlClause['sort'] = [...(sqlClause.sort ?? []), [nextCursorProperty, sortOrder ?? 1]];

	return {
		...sqlClause,
		sort,
		filter: [...(sqlClause.filter ?? []), ...filter],
	} as Partial<SqlClause>;
}
