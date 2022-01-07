import { AccessPermission, CreateAccessPayload, CreateAccessResponse } from '@bupd/types';
import faker from 'faker';
import { handleRequest, sleep } from './utils';

const permissions: AccessPermission[] = ['delete', 'read', 'update', 'write'];

export async function createAccess(
	policeTokens: string[],
	caseNumbers: number[],
	criminalIds: number[],
	totalAccess: number
) {
	const createAccessResponses: CreateAccessResponse[] = [];

	for (let accessNumber = 0; accessNumber < totalAccess; accessNumber += 1) {
		try {
			const isCriminal = faker.datatype.boolean();
			const access: CreateAccessPayload = {
				case_no: isCriminal ? null : faker.random.arrayElement(caseNumbers),
				criminal_id: isCriminal ? faker.random.arrayElement(criminalIds) : null,
				permission: faker.random.arrayElement(permissions),
			};
			const createAccessResponse = await handleRequest<CreateAccessResponse, CreateAccessPayload>(
				`access`,
				access,
				faker.random.arrayElement(policeTokens)
			);
			createAccessResponses.push(createAccessResponse);
			console.log(`Created access ${createAccessResponse.access_id}`);
			await sleep(150);
		} catch (err) {
			console.log(`Error creating access`);
		}
	}

	return createAccessResponses;
}
