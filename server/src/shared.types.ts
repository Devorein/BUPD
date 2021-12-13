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

export type TCaseFileStatus = 'solved' | 'open' | 'closed';
export interface ICriminal {
	id: number;
	name: string;
	photo: string;
}

export interface IVictim {
	victim_name: string;
	case_number: number;
}

export interface ICaseFileCriminal {
	case_number: number;
	criminal_id: number;
}

export interface IWeapon {
	name: string;
	case_number: number;
}

export interface ICrimeCategory {
	name: string;
	case_number: number;
}
export interface ICaseFile {
	crime_time: string;
	case_time: string;
	status: TCaseFileStatus;
	location: string;
	case_number: number;
}

export interface ICaseFilePopulated extends Omit<ICaseFile, 'case_time' | 'crime_time'> {
	case_time: string;
	crime_time: string;
	weapons: IWeapon[];
	crime_categories: ICrimeCategory[];
	victims: IVictim[];
	criminals: ICriminal[];
	police: IPolice;
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

export interface CreateCaseResponse extends ICaseFilePopulated {}

// All of our api endpoint will return either a success or error response
export type SuccessApiResponse<Data> = {
	status: 'success';
	data: Data;
};

export type ErrorApiResponse = {
	status: 'error';
	message: string;
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
