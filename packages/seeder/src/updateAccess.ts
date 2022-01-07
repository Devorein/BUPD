import { CreateAccessResponse, UpdateAccessPayload, UpdateAccessResponse } from '@bupd/types';
import faker from 'faker';
import { handleRequest, promiseAll } from './utils';

export async function updateAccess(accesses: CreateAccessResponse[], adminToken: string) {
	const updateAccessPromises: Promise<UpdateAccessResponse>[] = [];
	for (let accessNumber = 0; accessNumber < accesses.length; accessNumber += 1) {
		const access = accesses[accessNumber];

		updateAccessPromises.push(
			new Promise((resolve, reject) => {
				async function main() {
					try {
						const createAccessResponse = await handleRequest<
							UpdateAccessResponse,
							UpdateAccessPayload
						>(
							`access/${access.access_id}`,
							{
								approved: faker.random.arrayElement([0, 1, 2]),
							},
							adminToken,
							{
								method: 'PUT',
							}
						);
						resolve(createAccessResponse);
						console.log(`Updated access ${access.access_id}`);
					} catch (err) {
						reject(err.message);
					}
				}
				main();
			})
		);
	}

	const updateAccessResponses = await promiseAll(updateAccessPromises);
	return updateAccessResponses;
}
