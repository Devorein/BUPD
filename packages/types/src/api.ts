// All of our api endpoint will return either a success or error response
export type SuccessApiResponse<Data> = {
	status: 'success';
	data: Data;
};

export type ErrorApiResponse = {
	status: 'error';
	message: string;
};

export type NextKey = null | {
	id: number;
	[key: string]: any;
};

export type PaginatedResponse<Data> = {
	total: number;
	items: Data[];
	next: NextKey;
};

export type ApiResponse<Data> = SuccessApiResponse<Data> | ErrorApiResponse;
