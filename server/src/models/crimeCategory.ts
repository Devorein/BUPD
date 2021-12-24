import { ICrimeCategory } from '../shared.types';
import { generateInsertQuery, query, transformCrimeCategoryData } from '../utils';

const CrimeCategoryModel = {
	async create(payload: ICrimeCategory) {
		await query(generateInsertQuery(payload, 'crime_category'));
		return transformCrimeCategoryData(payload);
	},
};

export default CrimeCategoryModel;
