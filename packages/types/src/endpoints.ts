import { ApiResponse, NextKey, PaginatedResponse } from './api';
import {
	IAccess,
	IAccessPopulated,
	IAdmin,
	ICasefile,
	ICasefilePopulated,
	ICriminal,
	ICriminalPopulated,
	IPolice,
	IPolicePopulated,
	IVictim,
	TAccessPermission,
	TAccessType,
	TCasefilePriority,
	TCasefileStatus,
} from './entities';

// Api Endpoint type definitions
export interface RegisterPolicePayload extends IPolice {}
export interface RegisterPoliceResponse extends Omit<IPolice, 'password'> {}
// You shouldn't be able to update police password using this endpoint
// there should be a separate endpoint for that as you need to provide your current password if you want to update it
export interface UpdatePolicePayload extends Omit<IPolice, 'password' | 'nid'> {}
export interface UpdateVictimPayload extends IVictim {
	old_name: string;
}
export type UpdateVictimResponse = IVictim;

export interface UpdateCriminalPayload extends Omit<ICriminal, 'criminal_id'> {}
export interface UpdateCriminalResponse extends ICriminal {}
export interface UpdatePoliceResponse extends Omit<IPolice, 'password'> {
	token: string;
}

export type GetCurrentUserResponse = ApiResponse<
	(IAdmin & { type: 'admin' }) | (IPolice & { type: 'police' }) | null
>;

export interface LoginPayload {
	email: string;
	password: string;
	as: 'admin' | 'police';
}
export type LoginResponse = (IPolice | IAdmin) & { token: string };

export interface NewCriminalPayload {
	name: string;
	photo?: string;
}
export interface CreateCasefilePayload {
	categories: string[];
	weapons: string[];
	time: number;
	status?: TCasefileStatus | null;
	location: string;
	criminals: (NewCriminalPayload | { id: number })[];
	priority: TCasefilePriority;
	victims: {
		name: string;
		address?: string | null;
		age?: number | null;
		phone_no?: string | null;
		description?: string | null;
	}[];
}
export interface UpdateCasefilePayload extends Omit<ICasefile, 'case_no' | 'police_nid' | 'time'> {}
export interface UpdateCasefileResponse extends ICasefile {}

export interface CreateCasefileResponse extends Omit<ICasefilePopulated, 'police'> {}

export type UpdateAccessPayload = Pick<IAccess, 'approved'>;
export interface UpdateAccessResponse extends IAccess {}
export interface GetDashboardPayload {}
export interface IDashboard {
	polices: Record<string, number>;
	casefiles: {
		priority: Record<TCasefilePriority, number>;
		status: Record<TCasefileStatus, number>;
	};
	criminals: number;
	victims: number;
	crimes: {
		category: Record<string, number>;
		weapon: Record<string, number>;
	};
	accesses: {
		type: Record<TAccessType, number>;
		permission: Record<TAccessPermission, number>;
		approval: Record<IAccess['approved'], number>;
	};
}
export type GetDashboardResponse = ApiResponse<IDashboard>;
export interface IAccessFilter {
	approved: IAccess['approved'][];
	permission: TAccessPermission[];
	type: TAccessType[];
}
export interface ICasefileFilter {
	status: ICasefile['status'][];
	priority: ICasefile['priority'][];
	time: [string?, string?];
}
export interface ICriminalFilter {}
export type IAccessSort = ['criminal_id' | 'case_no' | 'approved' | 'permission', -1 | 1];
export type ICriminalSort = ['criminal_id' | 'name', -1 | 1];
export type ICasefileSort = ['case_no' | 'priority' | 'status' | 'time', -1 | 1];
export interface IPoliceFilter {
	designation?: string[];
	rank?: string[];
}

export interface IVictimFilter {
	age: [number?, number?];
}

export type IVictimSort = ['name' | 'age' | 'case_no', -1 | 1];

export type IPoliceSort = ['designation' | 'rank' | 'name', -1 | 1];

export interface IQuery<Filter, Sort> {
	filter: Filter & { search?: number[] };
	sort: Sort;
	limit: number;
	next: NextKey;
}

export interface GetVictimsPayload extends IQuery<IVictimFilter, IVictimSort> {}
export type GetVictimsResponse = ApiResponse<PaginatedResponse<IVictim>>;

export interface GetPolicesPayload extends IQuery<IPoliceFilter, IPoliceSort> {}
export interface DeletePolicePayload {
	nid: number;
}
export interface DeleteCasefilePayload {
	case_no: number;
}
export interface DeleteCriminalPayload {
	criminal_id: number;
}
export type GetPolicesResponse = ApiResponse<PaginatedResponse<IPolicePopulated>>;
export type DeletePoliceResponse = ApiResponse<IPolice>;
export type GetPoliceResponse = ApiResponse<Omit<IPolice, 'password'>>;
export type DeleteCasefileResponse = ApiResponse<ICasefile>;
export type GetCasefileResponse = ApiResponse<ICasefile>;
export type DeleteCriminalResponse = ApiResponse<ICriminal>;
export interface GetAccessesPayload extends IQuery<IAccessFilter, IAccessSort> {}
export type GetAccessesResponse = ApiResponse<PaginatedResponse<IAccessPopulated>>;
export type GetCasefilesResponse = ApiResponse<PaginatedResponse<ICasefile>>;
export type GetCasefilesPayload = IQuery<ICasefileFilter, ICasefileSort>;
export type GetCriminalsPayload = IQuery<ICriminalFilter, ICriminalSort>;
export type GetCriminalsResponse = ApiResponse<PaginatedResponse<ICriminalPopulated>>;
export type GetPoliceAccessesResponse = ApiResponse<PaginatedResponse<IAccess>>;
export interface GetPoliceAccessesPayload extends GetAccessesPayload {}
export type AccessPermission = 'read' | 'write' | 'update' | 'delete';

export interface CreateAccessPayload {
	case_no: number | null;
	criminal_id: number | null;
	permission: AccessPermission;
}
export interface CreateAccessResponse extends IAccess {}
export interface DeleteVictimPayload {
	name: string;
	case_no: number;
}

export type DeleteVictimResponse = ApiResponse<IVictim>;

// Removing confidential information from jwt payload
export interface AdminJwtPayload extends Omit<IAdmin, 'password'> {
	type: 'admin';
}
export interface PoliceJwtPayload
	extends Omit<IPolice, 'password' | 'address' | 'designation' | 'name' | 'phone'> {
	type: 'police';
}

export type JwtPayload = PoliceJwtPayload | AdminJwtPayload;
