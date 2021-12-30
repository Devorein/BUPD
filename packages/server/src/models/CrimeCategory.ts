import { ICrimeCategory } from '@bupd/types';
import { generateInsertQuery, query } from '../utils';

const CrimeCategoryModel = {
	async create(payload: ICrimeCategory) {
		await query(generateInsertQuery(payload, 'CrimeCategory'));
		return payload;
	},
};

export default CrimeCategoryModel;
