import { ApiResponse } from '@shared';
import axios from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import { SERVER_URL } from '../constants';

export function useApiMutation<R, P>(
	keys: string[],
	endpoint: string,
	options?: UseMutationOptions<ApiResponse<R>, string, P>
) {
	return useMutation<ApiResponse<R>, string, P>(
		keys,
		async (payload) => {
			const { data: response } = await axios.post<ApiResponse<R>>(
				`${SERVER_URL!}/${endpoint}`,
				payload
			);
			if (response.status === 'error') {
				throw new Error(response.message);
			}
			return response;
		},
		options
	);
}
