// Entity type definitions
export interface IAdmin {
	email: string;
	id: number;
	password: string;
}

export interface IPolice {
	email: string;
	phone: string;
	address: string;
	designation: string;
	nid: number;
	name: string;
	password: string;
	rank: string;
}

export interface IPolicePopulated extends IPolice {
	reported_cases: number;
}

export interface ICriminal {
	criminal_id: number;
	name: string;
	photo: string | null;
}

export interface IVictim {
	name: string;
	address: string | null;
	age: number | null;
	phone_no: string | null;
	description: string | null;
	case_no: number;
}

export type TAccessPermission = 'read' | 'write' | 'update' | 'delete';
export type TAccessType = 'case' | 'criminal';
export type TAccessApproval = 1 | 0 | 2;

export interface IAccess {
	access_id: number;
	permission: TAccessPermission;
	approved: TAccessApproval;
	police_nid: number;
	type: TAccessType;
	criminal_id: number | null;
	case_no: number | null;
	admin_id: number | null;
}

export interface ICasefileCriminal {
	case_no: number;
	criminal_id: number;
}

export interface ICrimeWeapon {
	weapon: string;
	case_no: number;
}

export interface ICrimeCategory {
	category: string;
	case_no: number;
}

export type TCasefileStatus = 'solved' | 'open' | 'closed';

export type TCasefilePriority = 0 | 1 | 2;

export interface ICasefile {
	time: string;
	priority: TCasefilePriority;
	status: TCasefileStatus;
	location: string;
	case_no: number;
	police_nid: number;
}

export interface ICasefileIntermediate extends ICasefile {
	crime_weapon: {
		weapon: string;
	};
	crime_category: {
		category: string;
	};
	permissions: string;
}

export interface ICriminalIntermediate extends ICriminal {
	permissions: string;
	total_cases: number;
}

export type IPermissionsRecord = Partial<Record<TAccessPermission, TAccessApproval>>;

export interface ICasefilePopulated extends ICasefile {
	weapons: string[];
	categories: string[];
	victims: IVictim[];
	criminals: ICriminal[];
	permissions?: IPermissionsRecord;
}

export interface IAccessPopulated extends IAccess {
	police: Omit<IPolice, 'password'>;
	casefile: null | ICasefile;
	criminal: null | ICriminal;
}

export interface ICriminalPopulated extends ICriminal {
	total_cases: number;
	permissions?: IPermissionsRecord;
}
