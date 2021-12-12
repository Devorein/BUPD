export interface LoginPayload {
	nid: number;
	password: string;
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
