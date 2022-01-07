/* eslint-disable import/no-extraneous-dependencies */
import { ApiResponse } from '@bupd/types';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import colors from 'colors';

export async function handleRequest<Response, Payload>(
	endpoint: string,
	payload: Payload,
	token?: string,
	axiosConfig?: AxiosRequestConfig<Payload>
) {
	try {
		const PORT = process.env.SERVER_PORT!;
		const BASE_URL = `http://localhost:${PORT}/v1`;
		const headers: AxiosRequestHeaders = {};
		if (token) {
			headers.authorization = `Bearer ${token}`;
		}
		const response = await axios.request<Response, AxiosResponse<ApiResponse<Response>>, Payload>({
			url: `${BASE_URL}/${endpoint}`,
			data: payload,
			headers,
			method: axiosConfig?.method ?? 'POST',
			...(axiosConfig ?? {}),
		});
		if (response.data.status === 'success') {
			return response.data.data as Response;
		} else {
			throw new Error(response.data.message);
		}
	} catch (err) {
		throw new Error(err.message);
	}
}

// eslint-disable-next-line
export async function promiseAll<Data>(promises: Promise<Data>[]) {
	try {
		return await Promise.all(promises);
	} catch (err) {
		console.log(colors.red.bold(err.message));
		process.exit(0);
	}
}

export function sleep(milliseconds: number) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(null), milliseconds);
	});
}
