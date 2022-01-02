import { NextKey } from '@bupd/types';
import mysql from 'mysql2';
import {
	PrimitiveValues,
	SqlClause,
	SqlFilter,
	SqlFilterAnd,
	SqlFilterEqOperator,
	SqlFilterGteOperator,
	SqlFilterGtOperator,
	SqlFilterInOperator,
	SqlFilterIsOperator,
	SqlFilterLteOperator,
	SqlFilterLtOperator,
	SqlFilterNeqOperator,
	SqlFilterOperators,
	SqlFilterOr,
	SqlJoins,
} from '../types';

/**
 * Generates a sql statement with fields and escaped values extracted from the given object
 * @param payload The record to generate field, value pairs from
 * @param table The table to insert data to
 * @returns A sql statement
 */
export function generateInsertQuery<Payload extends Record<string, any>>(
	payload: Payload,
	table: string
) {
	// Storing all the fields and their corresponding values in array
	// So that we can join them later
	const entries = Object.entries(payload);
	const fields: string[] = [],
		values: (string | number)[] = [];
	entries.forEach(([field, value]) => {
		fields.push(`\`${field}\``);
		// Escaping all values to prevent SQL injection
		values.push(mysql.escape(value));
	});

	return `INSERT INTO ${table}(${fields.join(',')}) VALUES(${values.join(',')});`;
}

export function generateScalarClauses(
	andFilters: Record<string, PrimitiveValues | SqlFilterOperators>,
	namespace?: string
) {
	const innerWhereClauses: string[] = [];
	Object.entries(andFilters).forEach(([key, value]) => {
		if (value !== undefined) {
			const formattedKey = `${namespace ? `${namespace}.` : ''}\`${key}\``;
			if (Object.prototype.hasOwnProperty.call(value, '$lt')) {
				innerWhereClauses.push(
					`${formattedKey}<${mysql.escape((value as SqlFilterLtOperator).$lt)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$in')) {
				innerWhereClauses.push(
					`${formattedKey} IN(${(value as SqlFilterInOperator).$in
						.map((operand) => mysql.escape(operand))
						.join(',')})`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$lte')) {
				innerWhereClauses.push(
					`${formattedKey}<=${mysql.escape((value as SqlFilterLteOperator).$lte)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$is')) {
				innerWhereClauses.push(
					`${formattedKey} IS ${mysql.escape((value as SqlFilterIsOperator).$is)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$gte')) {
				innerWhereClauses.push(
					`${formattedKey}>=${mysql.escape((value as SqlFilterGteOperator).$gte)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$gt')) {
				innerWhereClauses.push(
					`${formattedKey}>${mysql.escape((value as SqlFilterGtOperator).$gt)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$eq')) {
				innerWhereClauses.push(
					`${formattedKey}=${mysql.escape((value as SqlFilterEqOperator).$eq)}`
				);
			} else if (Object.prototype.hasOwnProperty.call(value, '$neq')) {
				innerWhereClauses.push(
					`${formattedKey}!=${mysql.escape((value as SqlFilterNeqOperator).$neq)}`
				);
			} else {
				innerWhereClauses.push(`${formattedKey}=${mysql.escape(value)}`);
			}
		}
	});

	return innerWhereClauses.length !== 0 ? `(${innerWhereClauses.join(' AND ')})` : '';
}

export function generateLogicalOperationClauses(
	andFilters: SqlFilter,
	logicalOperator: 'OR' | 'AND',
	depth: number,
	namespace?: string
) {
	const clauses: string[] = [];
	andFilters.forEach((andFilter) => {
		if ((andFilter as SqlFilterOr).$or) {
			const orClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterOr).$or,
				'OR',
				depth + 1,
				namespace
			);
			if (orClauses) {
				clauses.push(orClauses);
			}
		} else if ((andFilter as SqlFilterAnd).$and) {
			const andClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterAnd).$and,
				'AND',
				depth + 1,
				namespace
			);
			if (andClauses) {
				clauses.push(andClauses);
			}
		} else {
			const scalarClauses = generateScalarClauses(
				andFilter as Record<string, PrimitiveValues | SqlFilterOperators>,
				namespace
			);
			if (scalarClauses) {
				clauses.push(scalarClauses);
			}
		}
	});

	const clause = clauses.join(` ${logicalOperator} `);

	if (clauses.length !== 0) {
		if (clauses.length !== 1) {
			return `(${clause})`;
		}
		return clause;
	}
	return '';
}

export function generateWhereClause(sqlFilters: SqlFilter, namespace?: string) {
	const whereClauses = generateLogicalOperationClauses(sqlFilters, 'AND', 0, namespace);
	return whereClauses.length !== 0 ? `WHERE ${whereClauses}` : '';
}

export function generateOrderbyClause(sorts: SqlClause['sort'], namespace?: string) {
	const sortClauses: string[] = [];
	sorts?.forEach(([sortKey, sortOrder]) => {
		sortClauses.push(
			`${namespace ? `${namespace}.` : ''}\`${sortKey}\` ${sortOrder === -1 ? 'DESC' : 'ASC'}`
		);
	});
	return sortClauses.length !== 0 ? `ORDER BY ${sortClauses.join(', ')}` : '';
}

export function generateLimitClause(limit: number) {
	return `LIMIT ${limit}`;
}

export function generateSetClause(payload: Record<string, any>) {
	return `SET ${Object.entries(payload)
		.map(([field, value]) => `\`${field}\`=${mysql.escape(value)}`)
		.join(',')}`;
}

export function generateJoinClause(joins: SqlJoins) {
	const tablesSet: Set<string> = new Set();

	return joins.length !== 0
		? joins
				.map(([leftTable, rightTable, leftTableAttribute, rightTableAttribute, joinType]) => {
					const joinClauseChunks: string[] = [];
					if (!tablesSet.has(leftTable)) {
						joinClauseChunks.push(`${leftTable} as ${leftTable}`);
					}

					joinClauseChunks.push(joinType ? `${joinType} JOIN` : 'INNER JOIN');
					joinClauseChunks.push(rightTable);
					if (!tablesSet.has(rightTable)) {
						joinClauseChunks.push(`as ${rightTable}`);
					}

					joinClauseChunks.push(
						`on ${leftTable}.${leftTableAttribute} = ${rightTable}.${rightTableAttribute}`
					);
					tablesSet.add(leftTable);
					tablesSet.add(rightTable);
					return joinClauseChunks.join(' ');
				})
				.join(' ')
		: '';
}

export function generateSelectQuery(sqlClause: SqlClause, table: string) {
	const clauses: string[] = [];
	const hasJoins = sqlClause.joins && sqlClause.joins.length !== 0;
	if (sqlClause.filter)
		clauses.push(generateWhereClause(sqlClause.filter, hasJoins ? table : undefined));
	if (sqlClause.sort)
		clauses.push(generateOrderbyClause(sqlClause.sort, hasJoins ? table : undefined));
	if (sqlClause.limit) clauses.push(generateLimitClause(sqlClause.limit));
	return `SELECT ${
		sqlClause.select
			? sqlClause.select
					.map((attribute) => (hasJoins ? `${attribute} as \`${attribute}\`` : `\`${attribute}\``))
					.join(',')
			: '*'
	} FROM ${hasJoins ? generateJoinClause(sqlClause.joins!) : table} ${clauses.join(' ')};`;
}

export function generateCountQuery(filterQuery: SqlFilter, table: string) {
	return `SELECT COUNT(*) as count FROM ${table} ${generateWhereClause(filterQuery)};`;
}

export function generateUpdateQuery(
	filterQuery: SqlFilter,
	payload: Record<string, any>,
	table: string
) {
	return `UPDATE ${table} ${generateSetClause(payload)} ${generateWhereClause(filterQuery)};`;
}

export function generateDeleteQuery(filterQuery: SqlFilter, table: string) {
	return `DELETE FROM ${table} ${generateWhereClause(filterQuery)};`;
}

export function generatePaginationQuery(
	sqlClause: SqlClause & { next?: NextKey },
	nextCursorProperty: string,
	nullableSortFields?: Record<string, string>
) {
	const filter: SqlFilter = [];
	const sortField = sqlClause.sort?.[0]?.[0];
	const sortOrder = sqlClause.sort?.[0]?.[1];
	const sortOperator = sqlClause.sort && sortOrder === -1 ? '$lt' : '$gt';

	const sqlClauseSort = sqlClause.sort;

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
				if (sqlClauseSort && secondarySortField) {
					sqlClauseSort.push([secondarySortField, sortOrder]);
				}
			} else if (secondarySortField) {
				// We have reached null for our cursor key, so use the secondary key as cursor
				// Use the tuples second value to sort the rest of the rows

				// Update the sort to use the secondary key as sort field
				if (sqlClauseSort?.[0]) {
					// eslint-disable-next-line
					sqlClauseSort[0][0] = secondarySortField;
				}

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
		if (sqlClauseSort && secondarySortField) {
			sqlClauseSort.push([secondarySortField, sortOrder]);
		}
	}

	const sort: SqlClause['sort'] = [...(sqlClauseSort ?? []), [nextCursorProperty, sortOrder ?? 1]];

	return {
		...sqlClause,
		sort,
		filter: [...(sqlClause.filter ?? []), ...filter],
	} as Partial<SqlClause>;
}
