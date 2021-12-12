export interface LoginPayload {
	email: string;
	password: string;
	as: 'admin' | 'police';
}
export interface IAdmin {
	email: string;
	id: number;
}

export interface RegisterPolicePayload {
	email: string;
	nid: number;
	name: string;
	password: string;
}

export interface UpdatePolicePayload {
	email: string;
	nid: number;
	name: string;
}

export interface IPolice {
	email: string;
	nid: number;
	name: string;
}

export type UpdatePoliceResponse = IPolice & { token: string };

export type SuccessApiResponse<Data> = {
	status: 'success';
	data: Data;
};

export type ErrorApiResponse = {
	status: 'error';
	message: string;
};

export type ApiResponse<Data> = SuccessApiResponse<Data> | ErrorApiResponse;
export interface AdminJwtPayload extends IAdmin {
	role: 'admin';
}

export interface PoliceJwtPayload extends IPolice {
	role: 'police';
}

export type JwtPayload = PoliceJwtPayload | AdminJwtPayload;

declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: PoliceJwtPayload | AdminJwtPayload;
	}
}
