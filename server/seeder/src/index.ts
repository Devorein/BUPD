/* eslint-disable import/no-extraneous-dependencies */
import { LoginPayload, LoginResponse } from 'bupd-server';
import colors from 'colors';
import dotenv from 'dotenv';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import { createPolice } from './police';
import { handleRequest } from './utils';

dotenv.config({
	path: path.join(__dirname, '.env'),
});

dotenv.config({
	path: path.join(__dirname, 'seeder.env'),
});

const connection = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
});

connection.connect(async (err) => {
	if (err) {
		console.log(colors.bold.red(err.message));
		process.exit(1);
	} else {
		try {
			console.log(colors.green.bold('Successfully connected to database'));
			const loginResponse = await handleRequest<LoginResponse, LoginPayload>('/auth/login', {
				as: 'admin',
				email: process.env.ADMIN_EMAIL!,
				password: process.env.ADMIN_PASSWORD!,
			});
			const adminToken = loginResponse.token;
			const polices = await createPolice(5, adminToken);
			console.log(polices);
			fs.writeFileSync(path.join(__dirname, 'polices.json'), JSON.stringify(polices), 'utf-8');
			connection.destroy();
		} catch (error) {
			console.log(colors.red.bold(error.message));
			connection.destroy();
		}
	}
});
