import {
	IAdmin,
	ICasefile,
	ICrimeCategory,
	ICrimeWeapon,
	ICriminal,
	IPolice,
	IVictim,
} from '../types';

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
		case_no: crimeCategory.case_no,
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
		case_no: victim.case_no,
		victim_name: victim.victim_name,
	};
}

export function transformWeaponData(weapon: ICrimeWeapon): ICrimeWeapon {
	return {
		case_no: weapon.case_no,
		name: weapon.name,
	};
}

export function transformCasefileData(caseFile: ICasefile): ICasefile {
	return {
		case_no: caseFile.case_no,
		case_time: caseFile.case_time,
		crime_time: caseFile.case_time,
		location: caseFile.location,
		status: caseFile.status,
	};
}
