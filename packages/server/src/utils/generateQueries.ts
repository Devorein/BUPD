import mysql from 'mysql2';
import { SqlClause, SqlFilter } from '../types';

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

export function generateWhereClause(filterQuery: SqlFilter) {
	const whereClauses: string[] = [];

	Object.entries(filterQuery).forEach(([field, value]) => {
		if (value !== null) {
			// Support for custom where operator
			if (Array.isArray(value)) {
				whereClauses.push(`\`${field}\`${value[0]}${mysql.escape(value[1])}`);
			} else {
				whereClauses.push(`\`${field}\`=${mysql.escape(value)}`);
			}
		}
	});
	return whereClauses.length !== 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
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

export function generateCountQuery(filterQuery: Record<string, any>, table: string) {
	return `SELECT COUNT(*) as count FROM ${table} ${generateWhereClause(filterQuery)};`;
}

export function generateUpdateQuery(
	filterQuery: Record<string, any>,
	payload: Record<string, any>,
	table: string
) {
	return `UPDATE ${table} ${generateSetClause(payload)} ${generateWhereClause(filterQuery)};`;
}

export function generateDeleteQuery(filterQuery: Record<string, any>, table: string) {
	return `DELETE FROM ${table} ${generateWhereClause(filterQuery)};`;
}
