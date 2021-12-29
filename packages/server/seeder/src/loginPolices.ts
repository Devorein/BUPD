import { IPolice, LoginPayload, LoginResponse } from '@bupd/server';
import colors from 'colors';
import { handleRequest, promiseAll } from './utils';

export async function loginPolices(polices: IPolice[]) {
	const loginPolicePromises: Promise<LoginResponse>[] = [];
	for (let index = 0; index < polices.length; index += 1) {
		const police = polices[index];
		loginPolicePromises.push(
			new Promise((resolve, reject) => {
				async function main() {
					try {
						const loginResponse = await handleRequest<LoginResponse, LoginPayload>(`/auth/login`, {
							as: 'police',
							email: police.email,
							password: police.password,
						});
						console.log(colors.blue.bold(`Logged police: ${police.name}`));
						resolve(loginResponse);
					} catch (err) {
						reject(err.message);
					}
				}
				main();
			})
		);
	}

	return promiseAll(loginPolicePromises);
}
