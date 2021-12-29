import { ApiResponse, ErrorApiResponse } from '@shared';
import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import { JWT_LS_KEY, SERVER_URL } from '../constants';

export function useApiMutation<R, P>(
	keys: string[],
	endpoint: string,
	options?: UseMutationOptions<ApiResponse<R>, string, P>
) {
	return useMutation<ApiResponse<R>, string, P>(
		keys,
		async (payload) => {
			try {
				let jwtToken: null | string = null;
				if (typeof window !== 'undefined') {
					jwtToken = localStorage.getItem(JWT_LS_KEY);
				}
				const { data: response } = await axios.post<ApiResponse<R>>(
					`${SERVER_URL!}/${endpoint}`,
					payload,
					{
						headers: {
							Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
						},
					}
				);
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
