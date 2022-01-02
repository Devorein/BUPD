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
	SqlFilterLteOperator,
	SqlFilterLtOperator,
	SqlFilterNeqOperator,
	SqlFilterOperators,
	SqlFilterOr,
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
	andFilters: Record<string, PrimitiveValues | SqlFilterOperators>
) {
	const innerWhereClauses: string[] = [];
	Object.entries(andFilters).forEach(([key, value]) => {
		if (Object.prototype.hasOwnProperty.call(value, '$lt')) {
			innerWhereClauses.push(`\`${key}\`<${mysql.escape((value as SqlFilterLtOperator).$lt)}`);
		} else if (Object.prototype.hasOwnProperty.call(value, '$in')) {
			innerWhereClauses.push(
				`\`${key}\` IN(${(value as SqlFilterInOperator).$in
					.map((operand) => mysql.escape(operand))
					.join(',')})`
			);
		} else if (Object.prototype.hasOwnProperty.call(value, '$lte')) {
			innerWhereClauses.push(`\`${key}\`<=${mysql.escape((value as SqlFilterLteOperator).$lte)}`);
		} else if (Object.prototype.hasOwnProperty.call(value, '$gte')) {
			innerWhereClauses.push(`\`${key}\`>=${mysql.escape((value as SqlFilterGteOperator).$gte)}`);
		} else if (Object.prototype.hasOwnProperty.call(value, '$gt')) {
			innerWhereClauses.push(`\`${key}\`>${mysql.escape((value as SqlFilterGtOperator).$gt)}`);
		} else if (Object.prototype.hasOwnProperty.call(value, '$eq')) {
			innerWhereClauses.push(`\`${key}\`=${mysql.escape((value as SqlFilterEqOperator).$eq)}`);
		} else if (Object.prototype.hasOwnProperty.call(value, '$neq')) {
			innerWhereClauses.push(`\`${key}\`!=${mysql.escape((value as SqlFilterNeqOperator).$neq)}`);
		} else {
			innerWhereClauses.push(`\`${key}\`=${mysql.escape(value)}`);
		}
	});

	return innerWhereClauses.length !== 0 ? `(${innerWhereClauses.join(' AND ')})` : '';
}

export function generateLogicalOperationClauses(
	andFilters: SqlFilter,
	logicalOperator: 'OR' | 'AND',
	depth: number
) {
	const clauses: string[] = [];
	andFilters.forEach((andFilter) => {
		if ((andFilter as SqlFilterOr).$or) {
			const orClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterOr).$or,
				'OR',
				depth + 1
			);
			if (orClauses) {
				clauses.push(orClauses);
			}
		} else if ((andFilter as SqlFilterAnd).$and) {
			const andClauses = generateLogicalOperationClauses(
				(andFilter as SqlFilterAnd).$and,
				'AND',
				depth + 1
			);
			if (andClauses) {
				clauses.push(andClauses);
			}
		} else {
			const scalarClauses = generateScalarClauses(
				andFilter as Record<string, PrimitiveValues | SqlFilterOperators>
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

export function generateWhereClause(sqlFilters: SqlFilter) {
	const whereClauses = generateLogicalOperationClauses(sqlFilters, 'AND', 0);
	return whereClauses.length !== 0 ? `WHERE ${whereClauses}` : '';
}

export function generateOrderbyClause(sorts: SqlClause['sort']) {
	const sortClauses: string[] = [];
	sorts?.forEach(([sortKey, sortOrder]) => {
		sortClauses.push(`\`${sortKey}\` ${sortOrder === -1 ? 'DESC' : 'ASC'}`);
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

export function generateSelectQuery(sqlClause: SqlClause, table: string) {
	const clauses: string[] = [];
	if (sqlClause.filter) clauses.push(generateWhereClause(sqlClause.filter));
	if (sqlClause.sort) clauses.push(generateOrderbyClause(sqlClause.sort));
	if (sqlClause.limit) clauses.push(generateLimitClause(sqlClause.limit));
	return `SELECT ${
		sqlClause.select ? sqlClause.select.map((attribute) => `\`${attribute}\``).join(',') : '*'
	} FROM ${table} ${clauses.join(' ')};`;
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
	nextCursorProperty: string
) {
	const filter: SqlFilter = [];

	if (sqlClause.next) {
		const sortField = sqlClause.sort?.[0]?.[0];
		const sortOrder = sqlClause.sort?.[0]?.[1];
		const sortOperator = sqlClause.sort && sortOrder === 1 ? '$gt' : '$lt';
		if (sortField && sortOrder) {
			filter.push({
				$or: [
					{
						[sortField]: {
							[sortOperator]: sqlClause.next[sortField],
						},
					},
					{
						[sortField]: sqlClause.next[sortField],
						[nextCursorProperty]: {
							[sortOperator]: sqlClause.next.id,
						},
					},
				],
			});
		} else {
			filter.push({
				[nextCursorProperty]: {
					$gt: sqlClause.next.id,
				},
			});
		}
	}

	const sort: SqlClause['sort'] = [...(sqlClause.sort ?? []), [nextCursorProperty, -1]];

	return {
		...sqlClause,
		sort,
		filter: [...(sqlClause.filter ?? []), ...filter],
	} as Partial<SqlClause>;
}
