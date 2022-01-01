import { ApiResponse } from '@bupd/types';
import axios from 'axios';
import { JWT_LS_KEY, SERVER_URL } from '../constants';

export async function apiRequest<ResponseData extends ApiResponse<any>>(endpoint: string) {
	let jwtToken: null | string = null;
	if (typeof window !== 'undefined') {
		jwtToken = localStorage.getItem(JWT_LS_KEY);
	}
	const response = await axios.get<ResponseData>(`${SERVER_URL!}/${endpoint}`, {
		headers: {
			Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
		},
	});

	if (response.data.status === 'error') {
		throw new Error(response.data.message);
	}
	return response.data;
}
