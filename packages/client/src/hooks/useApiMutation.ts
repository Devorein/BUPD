import { ApiResponse, ErrorApiResponse } from '@bupd/types';
import axios, { AxiosError, Method } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import { JWT_LS_KEY, SERVER_URL } from '../constants';

export function useApiMutation<Response, Payload>(
	keys: string[],
	endpoint: string,
	method?: Method,
	options?: UseMutationOptions<ApiResponse<Response>, string, Payload>
) {
	return useMutation<ApiResponse<Response>, string, Payload>(
		keys,
		async (payload) => {
			// Support for endpoints that required data from payload
			if ((payload as any).endpoint) {
				// eslint-disable-next-line
				endpoint = (payload as any).endpoint;
				delete (payload as any).endpoint;
			}

			try {
				let jwtToken: null | string = null;
				if (typeof window !== 'undefined') {
					jwtToken = localStorage.getItem(JWT_LS_KEY);
				}
				const { data: response } = await axios.request<ApiResponse<Response>>({
					url: `${SERVER_URL!}/${endpoint}`,
					data: payload,
					headers: {
						Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
					},
					method: method ?? 'post',
				});
				if (response.status === 'error') {
					throw new Error(response.message);
				}
				return response;
			} catch (err: any) {
				throw new Error(
					(err as AxiosError<ErrorApiResponse>)?.response?.data.message ?? err.message
				);
			}
		},
		options
	);
}
