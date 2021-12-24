/* eslint-disable import/no-unresolved */
import {
	ApiResponse,
	IPolice,
	LoginPayload,
	LoginResponse,
	RegisterPolicePayload,
	RegisterPoliceResponse,
} from '@backend';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import colors from 'colors';
import dotenv from 'dotenv';
import faker from 'faker';
import fs from 'fs';
import mysql from 'mysql';
import path from 'path';

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
	database: 'test',
});

export async function handleRequest<Response, Payload>(
	endpoint: string,
	payload: Payload,
	token?: string
) {
	const PORT = process.env.SERVER_PORT!;
	const BASE_URL = `http://localhost:${PORT}/v1`;
	const headers: AxiosRequestHeaders = {};
	if (token) {
		headers.authorization = `Bearer ${token}`;
	}
	const response = await axios.post<Response, AxiosResponse<ApiResponse<Response>>, Payload>(
		`${BASE_URL}/${endpoint}`,
		payload,
		{
			headers,
		}
	);
	if (response.data.status === 'success') {
		return response.data.data as Response;
	} else {
		throw new Error(response.data.message);
	}
}

// eslint-disable-next-line
export async function promiseAll<Data>(promises: Promise<Data>[]) {
	try {
		return await Promise.all(promises);
	} catch (err) {
		console.log(colors.red.bold(err.message));
		process.exit(0);
	}
}

connection.connect(async (err) => {
	if (err) {
		console.log(colors.bold.red(err.message));
		process.exit(1);
	} else {
		try {
			console.log(colors.green.bold('Successfully connected to database'));
			const polices: IPolice[] = [];
			const policeRanks = [
				'Constable',
				'Assistant Sub Inspector',
				'Sergeant',
				'Sub Inspector',
				'Inspector',
				'Assistant Superintendent',
				'Senior Assistant Superintendent',
				'Additional Superintendent',
				'Superintendent',
				'Additional Deputy Inspector General',
				'Deputy Inspector General',
				'Additional Inspector General',
				'Inspector General',
			];
			const TOTAL_POLICES = 5;
			const loginResponse = await handleRequest<LoginResponse, LoginPayload>('/auth/login', {
				as: 'admin',
				email: process.env.ADMIN_EMAIL!,
				password: process.env.ADMIN_PASSWORD!,
			});

			const adminToken = loginResponse.token;
			const registerPolicePromises: Promise<RegisterPoliceResponse>[] = [];

			for (let index = 0; index < TOTAL_POLICES; index += 1) {
				registerPolicePromises.push(
					new Promise((resolve, reject) => {
						async function main() {
							try {
								const police: IPolice = {
									address: `${faker.address.streetAddress()}, ${faker.address.cityName()}`,
									designation: `${faker.address.cityName()} Police Station`,
									email: faker.internet.email().toLowerCase(),
									name: `${faker.name.firstName()} ${faker.name.lastName()}`,
									nid: faker.datatype.number({
										max: 20000,
										min: 10000,
									}),
									password:
										faker.datatype.number({ max: 50, min: 20 }) +
										faker.internet.password() +
										faker.datatype.number({ max: 50, min: 20 }),
									phone: `+880${faker.datatype.number({ min: 10000000, max: 99999999 })}`,
									rank: faker.random.arrayElement(policeRanks),
								};
								polices.push(police);
								const registerPoliceResponse = await handleRequest<
									RegisterPoliceResponse,
									RegisterPolicePayload
								>('/casefile', police, adminToken);
								console.log(colors.blue.bold(`Registered police: ${police.name}`));
								resolve(registerPoliceResponse);
							} catch (error) {
								reject(error.message);
							}
						}
						main();
					})
				);
			}

			await promiseAll(registerPolicePromises);
			fs.writeFileSync(path.join(__dirname, 'polices.json'), JSON.stringify(polices), 'utf-8');
			connection.destroy();
		} catch (error) {
			console.log(colors.red.bold(error.message));
			connection.destroy();
		}
	}
});
