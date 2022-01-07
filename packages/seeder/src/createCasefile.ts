import {
	CASEFILE_PRIORITIES,
	CASEFILE_STATUSES,
	CRIME_CATEGORIES,
	CRIME_WEAPONS,
} from '@bupd/constants';
import { CreateCasefilePayload, CreateCasefileResponse } from '@bupd/types';
import dayjs from 'dayjs';
import faker from 'faker';
import { handleRequest, sleep } from './utils';

interface CreateCasefileSeederOptions {
	totalCaseFiles: number;
	maxCrimeCategoriesPerCase?: number;
	minCrimeCategoriesPerCase?: number;
	minCrimeWeaponsPerCase?: number;
	maxCrimeWeaponsPerCase?: number;
	maxVictimsPerCase?: number;
	minVictimsPerCase?: number;
	maxCriminalsPerCase?: number;
	minCriminalsPerCase?: number;
}

export async function createCasefile(
	policeTokens: string[],
	seederOptions: CreateCasefileSeederOptions
) {
	try {
		const {
			maxCriminalsPerCase = 5,
			minCriminalsPerCase = 1,
			totalCaseFiles,
			maxCrimeCategoriesPerCase = 3,
			maxCrimeWeaponsPerCase = 3,
			maxVictimsPerCase = 5,
			minCrimeCategoriesPerCase = 1,
			minCrimeWeaponsPerCase = 0,
			minVictimsPerCase = 1,
		} = seederOptions;

		const createCasefileResponses: CreateCasefileResponse[] = [];
		for (let caseNumber = 0; caseNumber < totalCaseFiles; caseNumber += 1) {
			const policeToken = faker.random.arrayElement(policeTokens);
			const totalCrimeWeapons = faker.datatype.number({
				max: maxCrimeWeaponsPerCase,
				min: minCrimeWeaponsPerCase,
			});
			const totalCrimeCategories = faker.datatype.number({
				max: maxCrimeCategoriesPerCase,
				min: minCrimeCategoriesPerCase,
			});
			const totalVictims = faker.datatype.number({
				max: maxVictimsPerCase,
				min: minVictimsPerCase,
			});
			const totalCriminals = faker.datatype.number({
				max: maxCriminalsPerCase,
				min: minCriminalsPerCase,
			});

			const weapons: CreateCasefilePayload['weapons'] = [];
			const categories: CreateCasefilePayload['categories'] = [];

			for (let index = 0; index < totalCrimeWeapons; index += 1) {
				weapons.push(faker.random.arrayElement(CRIME_WEAPONS));
			}

			for (let index = 0; index < totalCrimeCategories; index += 1) {
				categories.push(faker.random.arrayElement(CRIME_CATEGORIES));
			}

			const victims: CreateCasefilePayload['victims'] = [];
			for (let index = 0; index < totalVictims; index += 1) {
				victims.push({
					name: `${faker.name.firstName()} ${faker.name.lastName()}`,
					address: faker.address.streetAddress(),
					age: faker.datatype.number({
						max: 50,
						min: 10,
					}),
					description: faker.lorem.lines(faker.datatype.number({ min: 1, max: 3 })),
					phone_no: faker.phone.phoneNumber(),
				});
			}

			const criminals: CreateCasefilePayload['criminals'] = [];
			for (let index = 0; index < totalCriminals; index += 1) {
				criminals.push({
					name: `${faker.name.firstName()} ${faker.name.lastName()}`,
					photo: faker.image.imageUrl(undefined, undefined, undefined, true),
				});
			}

			createCasefileResponses.push(
				await handleRequest<CreateCasefileResponse, CreateCasefilePayload>(
					`casefile`,
					{
						categories: Array.from(new Set(categories)),
						criminals,
						status: faker.random.arrayElement(CASEFILE_STATUSES),
						location: `${faker.address.streetAddress()} ${faker.address.city()}`,
						priority: faker.random.arrayElement(CASEFILE_PRIORITIES),
						victims,
						weapons: Array.from(new Set(weapons)),
						time: faker.datatype.number({
							min: new Date(dayjs().subtract(1, 'year').toDate()).getTime(),
							max: Date.now(),
						}),
					},
					policeToken
				)
			);
			await sleep(150);
			console.log(`Created case ${caseNumber + 1}`);
		}

		await sleep(1000);

		return createCasefileResponses;
	} catch (err) {
		throw new Error(err.message);
	}
}
