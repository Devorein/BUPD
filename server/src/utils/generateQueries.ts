import mysql from 'mysql';

export function generateInsertQuery(payload: Record<string, any>, table: string) {
	// Storing all the fields and their corresponding values in array
	// So that we can concat them for later
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
