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

export interface IAccess {
	access_id: number;
	permission: TAccessPermission;
	approved: boolean;
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

export type TCasefilePriority = 'high' | 'low' | 'medium';

export interface ICasefile {
	time: string;
	priority: TCasefilePriority;
	status: TCasefileStatus;
	location: string;
	case_no: number;
	police_nid: number;
}

export interface ICasefilePopulated extends ICasefile {
	time: string;
	weapons: ICrimeWeapon[];
	categories: ICrimeCategory[];
	victims: IVictim[];
	criminals: ICriminal[];
	police: IPolice;
}

export interface WhereClauseQuery {
	filter?: Record<string, any>;
	sort?: [string, -1 | 1];
	limit?: number;
	select?: string[];
}

// Api Endpoint type definitions
export interface RegisterPolicePayload extends IPolice {}
export interface RegisterPoliceResponse extends Exclude<IPolice, 'password'> {}
// You shouldn't be able to update police password using this endpoint
// there should be a separate endpoint for that as you need to provide your current password if you want to update it
export interface UpdatePolicePayload extends Exclude<IPolice, 'password'> {}
export interface UpdateCriminalPayload extends Exclude<ICriminal, 'criminal_id'> {}
export interface UpdateCriminalResponse extends ICriminal {}
export interface UpdatePoliceResponse extends Exclude<IPolice, 'password'> {
	token: string;
}

export type CurrentUserResponse =
	| (IAdmin & { type: 'admin' })
	| (IPolice & { type: 'police' })
	| null;

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
export interface UpdateCasefilePayload extends Exclude<ICasefile, 'case_no'> {}
export interface UpdateCasefileResponse extends ICasefile {}

export interface CreateCasefileResponse extends Omit<ICasefilePopulated, 'police'> {}

export interface UpdateAccessPayload extends Exclude<IAccess, 'access_id'> {}
export interface UpdateAccessResponse extends IAccess {}
// All of our api endpoint will return either a success or error response
export type SuccessApiResponse<Data> = {
	status: 'success';
	data: Data;
};

export type ErrorApiResponse = {
	status: 'error';
	message: string;
};

export type PaginatedResponse<Data> = {
	total: number;
	items: Data[];
	next: null | {
		id: number;
	};
};

export type ApiResponse<Data> = SuccessApiResponse<Data> | ErrorApiResponse;

export interface IAccessFilter {
	approved: boolean;
	permission: TAccessPermission[];
	access_type: TAccessType;
}

export type IAccessSort = ['criminal_id' | 'case_no' | 'approved' | 'permission', -1 | 1];

export interface IPoliceFilter {
	designation?: string;
	rank?: string;
}

export type IPoliceSort = ['designation' | 'rank' | 'name', -1 | 1];

export interface IQuery<Filter, Sort> {
	filter: Filter;
	sort: Sort;
	limit: number;
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
export type DeleteCasefileResponse = ApiResponse<ICasefile>;
export type DeleteCriminalResponse = ApiResponse<ICriminal>;
export interface GetAccessPayload extends IQuery<IAccessFilter, IPoliceSort> {}
export type GetAccessResponse = ApiResponse<PaginatedResponse<IAccess>>;

export type AccessPermission = 'read' | 'write' | 'update' | 'delete';

export interface CreateAccessPayload {
	case_no: number | null;
	criminal_id: number | null;
	permission: AccessPermission;
}
export interface CreateAccessResponse {}

// Removing confidential information from jwt payload
export interface AdminJwtPayload extends Exclude<IAdmin, 'password'> {
	type: 'admin';
}
export interface PoliceJwtPayload
	extends Exclude<IPolice, 'password' | 'address' | 'designation' | 'name' | 'phone'> {
	type: 'police';
}

export type JwtPayload = PoliceJwtPayload | AdminJwtPayload;
