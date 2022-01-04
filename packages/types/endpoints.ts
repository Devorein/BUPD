import { ApiResponse, NextKey, PaginatedResponse } from './api';
import {
	IAccess,
	IAccessPopulated,
	IAdmin,
	ICasefile,
	ICasefilePopulated,
	ICriminal,
	IPolice,
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
export interface UpdatePolicePayload extends Omit<IPolice, 'password'> {}
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
export interface UpdateCasefilePayload extends Omit<ICasefile, 'case_no'> {}
export interface UpdateCasefileResponse extends ICasefile {}

export interface CreateCasefileResponse extends Omit<ICasefilePopulated, 'police'> {}

export type UpdateAccessPayload = Pick<IAccess, 'approved'>;
export interface UpdateAccessResponse extends IAccess {}

export interface IAccessFilter {
	approved: IAccess['approved'][];
	permission: TAccessPermission[];
	type: TAccessType[];
}
export interface ICasefileFilter {
	status: ICasefile['status'][];
	priority: ICasefile['priority'][];
}
export interface ICriminalFilter {}
export type IAccessSort = ['criminal_id' | 'case_no' | 'approved' | 'permission', -1 | 1];
export type ICriminalSort = ['criminal_id' | 'name', -1 | 1];
export type ICasefileSort = ['case_no' | 'priority' | 'status' | 'time', -1 | 1];
export interface IPoliceFilter {
	designation?: string[];
	rank?: string[];
}

export type IPoliceSort = ['designation' | 'rank' | 'name', -1 | 1];

export interface IQuery<Filter, Sort> {
	filter: Filter;
	sort: Sort;
	limit: number;
	next: NextKey;
}

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
export type GetPolicesResponse = ApiResponse<PaginatedResponse<IPolice>>;
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
export type GetCriminalsResponse = ApiResponse<PaginatedResponse<ICriminal>>;
export type AccessPermission = 'read' | 'write' | 'update' | 'delete';

export interface CreateAccessPayload {
	case_no: number | null;
	criminal_id: number | null;
	permission: AccessPermission;
}
export interface CreateAccessResponse {}

// Removing confidential information from jwt payload
export interface AdminJwtPayload extends Omit<IAdmin, 'password'> {
	type: 'admin';
}
export interface PoliceJwtPayload
	extends Omit<IPolice, 'password' | 'address' | 'designation' | 'name' | 'phone'> {
	type: 'police';
}

export type JwtPayload = PoliceJwtPayload | AdminJwtPayload;
