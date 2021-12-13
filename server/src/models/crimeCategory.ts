import { ICrimeCategory } from '../shared.types';
import { generateInsertQuery, normalizeCrimeCategory, query } from '../utils';

const CrimeCategoryModel = {
	async create(payload: ICrimeCategory) {
		await query(generateInsertQuery(payload, 'crime_category'));
		return normalizeCrimeCategory(payload);
	},
};

export default CrimeCategoryModel;
