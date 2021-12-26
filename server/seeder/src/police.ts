/* eslint-disable import/no-extraneous-dependencies */
import { IPolice, RegisterPolicePayload, RegisterPoliceResponse } from 'bupd-server';
import colors from 'colors';
import faker from 'faker';
import { handleRequest, promiseAll } from './utils';

export async function createPolice(TOTAL_POLICES: number, adminToken: string) {
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

	const registerPolicePromises: Promise<RegisterPoliceResponse>[] = [];
	const polices: IPolice[] = [];

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
						>('/auth/register', police, adminToken);
						console.log(colors.blue.bold(`Registered police: ${police.name}`));
						resolve(registerPoliceResponse);
					} catch (error) {
						console.log(error);
						reject(error.message);
					}
				}
				main();
			})
		);
	}
	await promiseAll(registerPolicePromises);
	return polices;
}
