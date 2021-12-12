export interface RegisterPolicePayload {
	nid: number;
	name: string;
	password: string;
}

export interface IPolice {
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
