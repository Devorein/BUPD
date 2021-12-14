import { IWeapon } from '../shared.types';
import { generateInsertQuery, transformWeaponData } from '../utils';
import query from '../utils/query';

const WeaponModel = {
	async create(payload: IWeapon) {
		await query(generateInsertQuery(payload, 'weapon'));
		return transformWeaponData(payload);
	},
};

export default WeaponModel;
