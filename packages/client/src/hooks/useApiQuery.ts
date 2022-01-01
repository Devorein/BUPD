import { ApiResponse } from '@bupd/types';
import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { apiRequest } from '../utils/apiRequest';

export function useApiQuery<ResponseData extends ApiResponse<any>, ModifiedData = ResponseData>(
	key: QueryKey,
	endpoint: string,
	useQueryOptions?: Omit<UseQueryOptions<ResponseData, Error, ModifiedData>, 'queryFn'>
): UseQueryResult<ModifiedData, Error> {
	return useQuery<ResponseData, Error, ModifiedData>({
		...useQueryOptions,
		queryKey: useQueryOptions?.queryKey ?? key,
		async queryFn() {
			return apiRequest<ResponseData>(endpoint);
		},
	});
}
