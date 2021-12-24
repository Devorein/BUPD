import { ICrimeWeapon } from '../shared.types';
import { generateInsertQuery, transformWeaponData } from '../utils';
import query from '../utils/query';

const CrimeWeaponModel = {
	async create(payload: ICrimeWeapon) {
		await query(generateInsertQuery(payload, 'weapon'));
		return transformWeaponData(payload);
	},
};

export default CrimeWeaponModel;
