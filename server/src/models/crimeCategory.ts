import { ICrimeCategory } from '../shared.types';
import { generateInsertQuery, query } from '../utils';

const CrimeCategoryModel = {
	async create(payload: ICrimeCategory) {
		await query(generateInsertQuery(payload, 'crime_category'));
		return payload;
	},
};

export default CrimeCategoryModel;
