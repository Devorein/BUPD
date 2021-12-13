import { IWeapon } from '../shared.types';
import { generateInsertQuery, normalizeWeapon } from '../utils';
import query from '../utils/query';

const WeaponModel = {
	async create(payload: IWeapon) {
		await query(generateInsertQuery(payload, 'weapon'));
		return normalizeWeapon(payload);
	},
};

export default WeaponModel;
