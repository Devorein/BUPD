import { ICrimeWeapon } from '@bupd/types';
import { PoolConnection } from 'mysql2/promise';
import { generateInsertQuery } from '../utils';
import { useQuery } from './utils/useQuery';

const CrimeWeaponModel = {
	async create(crimeWeaponData: ICrimeWeapon, connection?: PoolConnection) {
		const crimeWeapon: ICrimeWeapon = {
			case_no: crimeWeaponData.case_no,
			weapon: crimeWeaponData.weapon,
		};

		await useQuery(generateInsertQuery(crimeWeapon, 'Crime_Weapon'), connection);
		return crimeWeapon;
	},
};

export default CrimeWeaponModel;
