import connection from './connect';

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
