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
	id: number;
	name: string;
	photo: string;
}

export interface IVictim {
	name: string;
	address: string;
	age: number;
	phone_no: number;
	description: string;
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

export interface ICasefilePopulated extends Omit<ICasefile, 'case_time' | 'crime_time'> {
	case_time: string;
	crime_time: string;
	weapons: ICrimeWeapon[];
	crime_categories: ICrimeCategory[];
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
export interface UpdatePoliceResponse extends Exclude<IPolice, 'password'> {
	token: string;
}

export type CurrentUserResponse = (IAdmin & { type: 'admin' }) | (IPolice & { type: 'police' });

export interface LoginPayload {
	email: string;
	password: string;
	as: 'admin' | 'police';
}
export type LoginResponse = (IPolice | IAdmin) & { token: string };

export interface CreateCasePayload {
	crime_categories: string[];
	weapons: string[];
	crime_time: number;
	location: string;
	criminals: ({ name: string; photo: string } | { id: number })[];
	victims: string[];
}

export interface CreateCaseResponse extends ICasefilePopulated {}

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

// Removing confidential information from jwt payload
export interface AdminJwtPayload extends Exclude<IAdmin, 'password'> {
	type: 'admin';
}
export interface PoliceJwtPayload
	extends Exclude<IPolice, 'password' | 'address' | 'designation' | 'name' | 'phone'> {
	type: 'police';
}

export type JwtPayload = PoliceJwtPayload | AdminJwtPayload;

export interface IPoliceFilter {
	designation?: string;
	rank?: string;
}

export type IPoliceSort = ['designation' | 'rank' | 'name', -1 | 1];

export interface IPoliceQuery<Filter = Partial<IPolice>> {
	filter: Filter;
	sort: IPoliceSort;
	limit: number;
}

export interface GetPolicesPayload extends IPoliceQuery<IPoliceFilter> {}

export interface DeletePolicePayload {
	nid: number;
}
export type GetPolicesResponse = ApiResponse<PaginatedResponse<IPolice>>;
export type DeletePoliceResponse = ApiResponse<IPolice>;
