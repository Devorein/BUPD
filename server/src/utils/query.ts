import connection from './connect';

export default function query(queryString: string) {
	return new Promise((resolve, reject) => {
		connection.query(queryString, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
}
