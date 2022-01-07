/* eslint-disable camelcase */
import {
	ICasefile,
	ICasefileIntermediate,
	ICasefilePopulated,
	TCasefileStatus,
	UpdateCasefilePayload,
} from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { SqlFilter } from '../types';
import {
	generateDeleteQuery,
	generateInsertQuery,
	generateUpdateQuery,
	pool,
	query,
	removeFields,
} from '../utils';
import { getCasefileAttributes } from '../utils/generateAttributes';
import { inflateObject } from '../utils/inflateObject';
import { setDifference } from '../utils/setDifference';
import CrimeCategoryModel from './CrimeCategory';
import CrimeWeaponModel from './CrimeWeapon';
import { find } from './utils';
import { useQuery } from './utils/useQuery';

const CasefileModel = {
	async findByCaseNo(case_no: number) {
		const [casefile] = await find<ICasefileIntermediate>(
			{
				filter: [{ case_no }],
				select: [
					...getCasefileAttributes('Casefile'),
					{
						aggregation: ['DISTINCT', 'GROUP_CONCAT'],
						attribute: 'weapon',
						namespace: 'Crime_Weapon',
					},
					{
						aggregation: ['DISTINCT', 'GROUP_CONCAT'],
						attribute: 'category',
						namespace: 'Crime_Category',
					},
				],
				joins: [
					['Casefile', 'Crime_Weapon', 'case_no', 'case_no', 'LEFT'],
					['Casefile', 'Crime_Category', 'case_no', 'case_no', 'LEFT'],
				],
				groups: ['Casefile.case_no'],
			},
			'Casefile'
		);

		if (!casefile) {
			return null;
		}

		const inflatedObject = inflateObject<ICasefileIntermediate>(casefile, 'Casefile');

		return {
			case_no: inflatedObject.case_no,
			location: inflatedObject.location,
			priority: inflatedObject.priority,
			status: inflatedObject.status,
			police_nid: inflatedObject.police_nid,
			time: inflatedObject.time,
			categories: inflatedObject.crime_category.category?.split(',') ?? [],
			weapons: inflatedObject.crime_weapon.weapon?.split(',') ?? [],
			criminals: [],
			victims: [],
		} as ICasefilePopulated;
	},

	async create(
		casefileData: Omit<ICasefile, 'time' | 'status'> & {
			time: number;
			status?: TCasefileStatus | null;
		},
		connection?: PoolConnection
	) {
		const casefile: ICasefile = {
			case_no: casefileData.case_no,
			time: new Date(casefileData.time).toISOString().slice(0, 19).replace('T', ' '),
			status: casefileData.status ?? 'open',
			priority: casefileData.priority,
			location: casefileData.location,
			police_nid: casefileData.police_nid,
		};
		await useQuery(generateInsertQuery(casefile, 'Casefile'), connection);
		return casefile;
	},

	async update(filterQuery: SqlFilter, payload: UpdateCasefilePayload & { case_no: number }) {
		const connection = await pool.getConnection();
		await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
		await connection.beginTransaction();

		const casefile = await CasefileModel.findByCaseNo(payload.case_no);
		if (!casefile) {
			return null;
		}

		const currentCategories = new Set(casefile.categories);
		const currentWeapons = new Set(casefile.weapons);
		const payloadCategories = new Set(payload.categories);
		const payloadWeapons = new Set(payload.weapons);
		// Using a set to make sure there are no duplicate items
		const newCategories = Array.from(setDifference(payloadCategories, currentCategories)),
			newWeapons = Array.from(setDifference(payloadWeapons, currentWeapons)),
			removedCategories = Array.from(setDifference(currentCategories, payloadCategories)),
			removedWeapons = Array.from(setDifference(currentWeapons, payloadWeapons));
		for (let index = 0; index < newCategories.length; index += 1) {
			await CrimeCategoryModel.create(
				{
					case_no: payload.case_no,
					category: newCategories[index],
				},
				connection
			);
		}

		for (let index = 0; index < newWeapons.length; index += 1) {
			await CrimeWeaponModel.create(
				{
					case_no: payload.case_no,
					weapon: newWeapons[index],
				},
				connection
			);
		}

		for (let index = 0; index < removedCategories.length; index += 1) {
			await CrimeCategoryModel.delete(
				{
					case_no: payload.case_no,
					category: removedCategories[index],
				},
				connection
			);
		}

		for (let index = 0; index < removedWeapons.length; index += 1) {
			await CrimeWeaponModel.delete(
				{
					case_no: payload.case_no,
					weapon: removedWeapons[index],
				},
				connection
			);
		}

		// Making sure that we are updating at least one field
		if (Object.keys(payload).length !== 0) {
			await query(
				generateUpdateQuery(
					filterQuery,
					removeFields(payload, ['case_no', 'weapons', 'categories']),
					'Casefile'
				),
				connection
			);
			// return the payload if the update operation was successful
			await connection.commit();
			connection.release();
			return {
				...casefile,
				...payload,
			};
		} else {
			return null;
		}
	},
	async delete(case_no: number) {
		await query(generateDeleteQuery([{ case_no }], 'Casefile'));
		return true;
	},
};

export default CasefileModel;
