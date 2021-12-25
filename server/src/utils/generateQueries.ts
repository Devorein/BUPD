import mysql from 'mysql';
import { WhereClauseQuery } from '../shared.types';

/**
 * Generates a sql statement with keys and escaped values extracted from the given object
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
		fields.push(field === 'rank' ? `\`${field}\`` : field);
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
		if (Object.keys(payload.filter).length === 0) {
			filterClause = '';
		} else {
			const whereClause = Object.entries(payload.filter)
				.map(([field, value]) =>
					value !== null ? `${field === 'rank' ? '`rank`' : field}=${mysql.escape(value)}` : ''
				)
				.join(' AND ');
			filterClause = whereClause !== '' ? `WHERE ${whereClause}` : '';
		}
		clauses.push(filterClause);
	}
	if (payload.sort) {
		const [attribute, order] = payload.sort;
		sortClause = `ORDER BY ${attribute} ${order === -1 ? 'DESC' : 'ASC'}`;
		clauses.push(sortClause);
	}

	if (payload.limit) {
		limitClause = `LIMIT ${payload.limit}`;
		clauses.push(limitClause);
	}
	return `${clauses.join(' ')}`;
}

export function generateSetClause(payload: Record<string, any>) {
	return `SET ${Object.entries(payload)
		.map(([key, value]) => `${key === 'rank' ? '`rank`' : key}=${mysql.escape(value)}`)
		.join(',')}`;
}

export function generateSelectQuery(whereClauseQuery: WhereClauseQuery, table: string) {
	return `SELECT ${
		whereClauseQuery.select ? whereClauseQuery.select.join(',') : '*'
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
	return `UPDATE ${table} ${generateSetClause(payload)} ${generateWhereClause(filterQuery)}`;
}
