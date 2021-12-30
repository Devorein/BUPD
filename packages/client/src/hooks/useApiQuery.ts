import { ApiResponse } from '@bupd/types';
import axios from 'axios';
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { JWT_LS_KEY, SERVER_URL } from '../constants';

export function useApiQuery<ResponseData = unknown, ModifiedData = ResponseData>(
	key: QueryKey,
	endpoint: string,
	useQueryOptions?: Omit<
		UseQueryOptions<ApiResponse<ResponseData>, Error, ApiResponse<ModifiedData>>,
		'queryFn'
	>
): UseQueryResult<ApiResponse<ModifiedData>, Error> {
	return useQuery<ApiResponse<ResponseData>, Error, ApiResponse<ModifiedData>>({
		...useQueryOptions,
		queryKey: useQueryOptions?.queryKey ?? key,
		async queryFn() {
			let jwtToken: null | string = null;
			if (typeof window !== 'undefined') {
				jwtToken = localStorage.getItem(JWT_LS_KEY);
			}
			const response = await axios.get<ApiResponse<ResponseData>>(`${SERVER_URL!}/${endpoint}`, {
				headers: {
					Authorization: jwtToken ? `Bearer ${jwtToken}` : '',
				},
			});

			if (response.data.status === 'error') {
				throw new Error(response.data.message);
			}
			return response.data;
		},
	});
}
