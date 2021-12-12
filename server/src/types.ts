import { JwtPayload } from 'jsonwebtoken';

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

export interface IPolice {
	email: string;
	nid: number;
	name: string;
}

export type SuccessApiResponse<Data> = {
	status: 'success';
	data: Data;
};

export type ErrorApiResponse = {
	status: 'error';
	message: string;
};

export type ApiResponse<Data> = SuccessApiResponse<Data> | ErrorApiResponse;

declare module 'express' {
	// eslint-disable-next-line
	interface Request {
		jwt_payload?: Record<string, any> | null | string | JwtPayload;
	}
}