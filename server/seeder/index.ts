import colors from 'colors';
import dotenv from 'dotenv';
import mysql from 'mysql';
import path from 'path';

dotenv.config({
	path: path.join(__dirname, '.env'),
});

const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: 'test',
});

connection.connect((err) => {
	if (err) {
		console.log(colors.bold.red(err.message));
		process.exit(1);
	} else {
		console.log(colors.green.bold('Successfully connected to database'));
	}
});
