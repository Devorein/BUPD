import connection from './connect';

/**
 * A wrapper around connection.query to make it async/await compatible
 * @param queryString SQL statement to execute
 * @param values array of values to be escaped
 * @returns A promise that either resolves with the response or reject with error
 */
export default function query(queryString: string, values?: any[]) {
	return new Promise((resolve, reject) => {
		connection.query({ sql: queryString, values }, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}
