import { AccessPermission, CreateAccessPayload, CreateAccessResponse } from 'bupd-server';
import faker from 'faker';
import { handleRequest, promiseAll } from './utils';

const permissions: AccessPermission[] = ['delete', 'read', 'update', 'write'];

export async function createAccess(
	policeTokens: string[],
	caseNumbers: number[],
	criminalIds: number[],
	totalAccess: number
) {
	const createAccessPromises: Promise<CreateAccessResponse>[] = [];
	for (let accessNumber = 0; accessNumber < totalAccess; accessNumber += 1) {
		createAccessPromises.push(
			new Promise((resolve, reject) => {
				async function main() {
					try {
						const isCriminal = faker.datatype.boolean();
						const access: CreateAccessPayload = {
							case_no: isCriminal ? null : faker.random.arrayElement(caseNumbers),
							criminal_id: isCriminal ? faker.random.arrayElement(criminalIds) : null,
							permission: faker.random.arrayElement(permissions),
						};
						const createAccessResponse = await handleRequest<
							CreateAccessResponse,
							CreateAccessPayload
						>(`/access`, access, faker.random.arrayElement(policeTokens));
						resolve(createAccessResponse);
						console.log(`Created access ${accessNumber + 1}`);
					} catch (err) {
						reject(err.message);
					}
				}
				main();
			})
		);
	}

	const createAccessResponses = await promiseAll(createAccessPromises);
	return createAccessResponses;
}
