import { ApiResponse } from '@shared';
import axios from 'axios';
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

export function useFunctionsQuery<
	RequestData = any,
	ResponseData = unknown,
	ModifiedData = ResponseData
>(
	key: QueryKey,
	endpoint: string,
	payload?: RequestData | null,
	useQueryOptions?: Omit<
		UseQueryOptions<ApiResponse<ResponseData>, Error, ApiResponse<ModifiedData>>,
		'queryFn'
	>
): UseQueryResult<ApiResponse<ModifiedData>, Error> {
	return useQuery<ApiResponse<ResponseData>, Error, ApiResponse<ModifiedData>>({
		...useQueryOptions,
		queryKey: useQueryOptions?.queryKey ?? key,
		async queryFn() {
			const response = await axios.post<ApiResponse<ResponseData>>(
				`${process.env.BASE_URL!}/${endpoint}`,
				payload
			);

			if (response.data.status === 'error') {
				throw new Error(response.data.message);
			}
			return response.data;
		},
	});
}
