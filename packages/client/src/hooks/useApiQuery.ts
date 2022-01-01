import { ApiResponse } from '@bupd/types';
import axios from 'axios';
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { JWT_LS_KEY, SERVER_URL } from '../constants';

export function useApiQuery<ResponseData extends ApiResponse<any>, ModifiedData = ResponseData>(
	key: QueryKey,
	endpoint: string,
	useQueryOptions?: Omit<UseQueryOptions<ResponseData, Error, ModifiedData>, 'queryFn'>
): UseQueryResult<ModifiedData, Error> {
	return useQuery<ResponseData, Error, ModifiedData>({
		...useQueryOptions,
		queryKey: useQueryOptions?.queryKey ?? key,
		async queryFn() {
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
		},
	});
}
