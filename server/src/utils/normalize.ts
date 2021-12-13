import { IAdmin, ICaseFile, ICrimeCategory, ICriminal, IPolice, IVictim, IWeapon } from '../types';

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

export function normalizeCrimeCategory(crimeCategory: ICrimeCategory): ICrimeCategory {
	return {
		case_number: crimeCategory.case_number,
		name: crimeCategory.name,
	};
}

export function normalizeCriminal(criminal: ICriminal): ICriminal {
	return {
		name: criminal.name,
		id: criminal.id,
		photo: criminal.photo,
	};
}

export function normalizeVictim(victim: IVictim): IVictim {
	return {
		case_number: victim.case_number,
		victim_name: victim.victim_name,
	};
}

export function normalizeWeapon(weapon: IWeapon): IWeapon {
	return {
		case_number: weapon.case_number,
		name: weapon.name,
	};
}

export function normalizeCaseFile(caseFile: ICaseFile): ICaseFile {
	return {
		case_number: caseFile.case_number,
		case_time: caseFile.case_time,
		crime_time: caseFile.case_time,
		location: caseFile.location,
		status: caseFile.status,
	};
}
