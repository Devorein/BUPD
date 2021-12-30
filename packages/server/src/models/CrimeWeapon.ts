import { ICrimeWeapon } from '@bupd/types';
import { generateInsertQuery } from '../utils';
import query from '../utils/query';

const CrimeWeaponModel = {
	async create(payload: ICrimeWeapon) {
		await query(generateInsertQuery(payload, 'CrimeWeapon'));
		return payload;
	},
};

export default CrimeWeaponModel;
