import { ICrimeCategory } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { generateDeleteQuery, generateInsertQuery } from '../utils';
import { useQuery } from './utils/useQuery';

const CrimeCategoryModel = {
	async create(crimeCategoryData: ICrimeCategory, connection?: PoolConnection) {
		const crimeCategory: ICrimeCategory = {
			case_no: crimeCategoryData.case_no,
			category: crimeCategoryData.category,
		};

		await useQuery(generateInsertQuery(crimeCategory, 'Crime_Category'), connection);
		return crimeCategory;
	},

	async delete(crimeCategoryData: ICrimeCategory, connection?: PoolConnection) {
		const crimeCategory: ICrimeCategory = {
			case_no: crimeCategoryData.case_no,
			category: crimeCategoryData.category,
		};

		await useQuery(generateDeleteQuery([crimeCategory as any], 'Crime_Category'), connection);
		return crimeCategory;
	},
};

export default CrimeCategoryModel;
