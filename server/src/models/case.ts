import { CreateCasePayload, ICaseFile } from '../shared.types';
import { generateInsertQuery, query, removeFields } from '../utils';

const CaseModel = {
	async create(payload: CreateCasePayload & { police_nid: number }): Promise<ICaseFile> {
		const response = (await query(
			generateInsertQuery(
				{
					...removeFields(payload, ['crime_categories', 'weapons', 'crime_time']),
					status: 'open',
					case_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
					crime_time: new Date(payload.crime_time).toISOString().slice(0, 19).replace('T', ' '),
				},
				'case_file'
			)
		)) as any;
		const crimeCategoryInsertQueryPromises: Promise<any>[] = payload.crime_categories.map(
			(crimeCategory) =>
				new Promise((resolve, reject) => {
					query(
						generateInsertQuery(
							{
								name: crimeCategory,
								case_number: response.insertId,
							},
							'crime_category'
						)
					)
						.then(() => resolve(null))
						.catch((err) => reject(err.message));
				})
		);

		const weaponInsertQueryPromises: Promise<any>[] = payload.weapons.map(
			(weapon) =>
				new Promise((resolve, reject) => {
					query(
						generateInsertQuery(
							{
								name: weapon,
								case_number: response.insertId,
							},
							'weapon'
						)
					)
						.then(() => resolve(null))
						.catch((err) => reject(err.message));
				})
		);

		await Promise.all(crimeCategoryInsertQueryPromises);
		await Promise.all(weaponInsertQueryPromises);

		return {
			...payload,
			case_number: response.insertId,
			case_time: Date.now(),
			status: 'open',
		};
	},
};

export default CaseModel;
