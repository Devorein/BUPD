import { LoginPayload, LoginResponse } from '@bupd/types';
import colors from 'colors';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import { createAccess } from './createAccess';
import { createCasefile } from './createCasefile';
import { createPolices } from './createPolices';
import { loginPolices } from './loginPolices';
import { handleRequest } from './utils';

export default function seeder() {
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
				const polices = await createPolices(50, adminToken);
				const loginPoliceResponses = await loginPolices(polices);
				const policeTokens = loginPoliceResponses.map(
					(loginPoliceResponse) => loginPoliceResponse.token
				);
				const createCasefileResponses = await createCasefile(policeTokens, {
					totalCaseFiles: 10,
				});
				const caseNumbers: number[] = [],
					criminalIds: number[] = [];

				createCasefileResponses.forEach((createCasefileResponse) => {
					caseNumbers.push(createCasefileResponse.case_no);
					createCasefileResponse.criminals.forEach((criminal) => {
						criminalIds.push(criminal.criminal_id);
					});
				});
				await createAccess(policeTokens, caseNumbers, criminalIds, 50);
				fs.writeFileSync(path.join(__dirname, 'polices.json'), JSON.stringify(polices), 'utf-8');
				connection.destroy();
			} catch (error) {
				console.log(colors.red.bold(error.message));
				connection.destroy();
			}
		}
	});
}
