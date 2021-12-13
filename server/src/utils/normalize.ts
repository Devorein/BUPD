import { IAdmin, IPolice } from '../types';

export function normalizePolice(
	police: IPolice & { password: string }
): IPolice & { password: string } {
	return {
		email: police.email,
		name: police.name,
		nid: police.nid,
		password: police.password,
		address: police.address,
		designation: police.designation,
		phone: police.phone,
		rank: police.rank,
	};
}

export function normalizeAdmin(admin: IAdmin & { password: string }) {
	return {
		email: admin.email,
		id: admin.id,
		password: admin.password,
	};
}
