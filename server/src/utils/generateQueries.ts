import mysql from 'mysql';

/**
 * Generates a sql statement with keys and escaped values extracted from the given object
 * @param payload The record to generate field, value pairs from
 * @param table The table to insert data to
 * @returns A sql statement
 */
export function generateInsertQuery(payload: Record<string, any>, table: string) {
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

export function generateSelectQuery(payload: Record<string, any>, table: string) {
	return `SELECT * FROM ${table} where ${Object.entries(payload)
		.map(([field, value]) => `${field}=${mysql.escape(value)}`)
		.join('and')};`;
}
