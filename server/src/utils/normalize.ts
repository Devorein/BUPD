import { IAdmin, ICaseFile, ICrimeCategory, ICriminal, IPolice, IVictim, IWeapon } from '../types';

export function transformPoliceData(
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

export function transformAdminData(admin: IAdmin & { password: string }) {
	return {
		email: admin.email,
		id: admin.id,
		password: admin.password,
	};
}

export function transformCrimeCategoryData(crimeCategory: ICrimeCategory): ICrimeCategory {
	return {
		case_number: crimeCategory.case_number,
		name: crimeCategory.name,
	};
}

export function transformCriminalData(criminal: ICriminal): ICriminal {
	return {
		name: criminal.name,
		id: criminal.id,
		photo: criminal.photo,
	};
}

export function transformVictimData(victim: IVictim): IVictim {
	return {
		case_number: victim.case_number,
		victim_name: victim.victim_name,
	};
}

export function transformWeaponData(weapon: IWeapon): IWeapon {
	return {
		case_number: weapon.case_number,
		name: weapon.name,
	};
}

export function transformCaseFileData(caseFile: ICaseFile): ICaseFile {
	return {
		case_number: caseFile.case_number,
		case_time: caseFile.case_time,
		crime_time: caseFile.case_time,
		location: caseFile.location,
		status: caseFile.status,
	};
}
