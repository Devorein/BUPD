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

function generateScalarClauses(andFilters: Record<string, PrimitiveValues | SqlFilterOperators>) {
	const innerWhereClauses: string[] = [];
	Object.entries(andFilters).forEach(([key, value]) => {
		if ((value as SqlFilterInOperator).$in) {
			innerWhereClauses.push(
				`\`${key}\` IN(${(value as SqlFilterInOperator).$in
					.map((operand) => mysql.escape(operand))
					.join(',')})`
			);
		} else if ((value as SqlFilterLtOperator).$lt) {
			innerWhereClauses.push(`\`${key}\` < ${mysql.escape(value as SqlFilterLtOperator)}`);
		} else if ((value as SqlFilterLteOperator).$lte) {
			innerWhereClauses.push(`\`${key}\` <= ${mysql.escape(value as SqlFilterLteOperator)}`);
		} else if ((value as SqlFilterGteOperator).$gte) {
			innerWhereClauses.push(`\`${key}\` >= ${mysql.escape(value as SqlFilterGteOperator)}`);
		} else if ((value as SqlFilterGtOperator).$gt) {
			innerWhereClauses.push(`\`${key}\` > ${mysql.escape(value as SqlFilterGtOperator)}`);
		} else if ((value as SqlFilterEqOperator).$eq) {
			innerWhereClauses.push(`\`${key}\` = ${mysql.escape(value as SqlFilterEqOperator)}`);
		} else if ((value as SqlFilterNeqOperator).$neq) {
			innerWhereClauses.push(`\`${key}\` != ${mysql.escape(value as SqlFilterNeqOperator)}`);
		} else {
			innerWhereClauses.push(`\`${key}\` = ${mysql.escape(value)}`);
		}
	});

	return innerWhereClauses.length !== 0 ? `(${innerWhereClauses.join(' AND ')})` : '';
}

function generateLogicalOperationClauses(
	andFilters: SqlFilter | SqlFilter[0],
	logicalOperator: 'OR' | 'AND'
) {
	const clauses: string[] = [];
	if (Array.isArray(andFilters)) {
		andFilters.forEach((andFilter) => {
			if ((andFilter as SqlFilterOr).$or) {
				clauses.push(generateLogicalOperationClauses((andFilter as SqlFilterOr).$or, 'OR'));
			} else if ((andFilter as SqlFilterAnd).$and) {
				const andClauses = generateLogicalOperationClauses((andFilter as SqlFilterAnd).$and, 'AND');
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
	} else {
		const scalarClauses = generateScalarClauses(
			andFilters as Record<string, PrimitiveValues | SqlFilterOperators>
		);
		if (scalarClauses) {
			clauses.push(scalarClauses);
		}
	}

	return clauses.length !== 0 ? `(${clauses.join(` ${logicalOperator} `)})` : '';
}

function generateWhereClause(sqlFilters: SqlFilter) {
	const whereClauses = generateLogicalOperationClauses(sqlFilters, 'AND');
	return whereClauses.length !== 0 ? `WHERE ${whereClauses}` : '';
}

export function generateOrderbyClause(sort: [string, -1 | 1]) {
	const [attribute, order] = sort;
	return `ORDER BY \`${attribute}\` ${order === -1 ? 'DESC' : 'ASC'}`;
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
		const sortOrder = sqlClause.sort ? sqlClause.sort[1] : 1;
		filter.push({
			[nextCursorProperty]: {
				[sortOrder === -1 ? '$gt' : ('$lt' as keyof SqlFilterOperators)]: sqlClause.next.id,
			},
		});
	}

	return {
		...sqlClause,
		filter: [...(sqlClause.filter ?? []), ...filter],
	} as Partial<SqlClause>;
}
