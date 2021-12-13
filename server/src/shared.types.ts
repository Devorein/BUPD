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
