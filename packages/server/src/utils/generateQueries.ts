import { WhereClauseQuery } from '@bupd/types';
import mysql from 'mysql2';

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

export function generateWhereClause(payload: WhereClauseQuery) {
	const clauses: string[] = [];
	let filterClause = '',
		sortClause = '',
		limitClause = '';
	if (payload.filter) {
		const whereClauses: string[] = [];

		Object.entries(payload.filter).forEach(([field, value]) => {
			if (value !== null) {
				whereClauses.push(`\`${field}\`=${mysql.escape(value)}`);
			}
		});
		filterClause = whereClauses.length !== 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
		clauses.push(filterClause);
	}
	if (payload.sort) {
		const [attribute, order] = payload.sort;
		sortClause = `ORDER BY \`${attribute}\` ${order === -1 ? 'DESC' : 'ASC'}`;
		clauses.push(sortClause);
	}

	if (payload.limit) {
		limitClause = `LIMIT ${payload.limit}`;
		clauses.push(limitClause);
	}
	return clauses.join(' ');
}

export function generateSetClause(payload: Record<string, any>) {
	return `SET ${Object.entries(payload)
		.map(([field, value]) => `\`${field}\`=${mysql.escape(value)}`)
		.join(',')}`;
}

export function generateSelectQuery(whereClauseQuery: WhereClauseQuery, table: string) {
	return `SELECT ${
		whereClauseQuery.select
			? whereClauseQuery.select.map((attribute) => `\`${attribute}\``).join(',')
			: '*'
	} FROM ${table} ${generateWhereClause(whereClauseQuery)};`;
}

export function generateCountQuery(
	whereClauseQuery: Pick<WhereClauseQuery, 'filter'>,
	table: string
) {
	return `SELECT COUNT(*) as count FROM ${table} ${generateWhereClause({
		filter: whereClauseQuery.filter,
	})};`;
}

export function generateUpdateQuery(
	filterQuery: Record<string, any>,
	payload: Record<string, any>,
	table: string
) {
	return `UPDATE ${table} ${generateSetClause(payload)} ${generateWhereClause({
		filter: filterQuery,
	})}`;
}

export function generateDeleteQuery(payload: Record<string, any>, table: string) {
	return `DELETE FROM ${table} ${generateWhereClause({ filter: payload })};`;
}
