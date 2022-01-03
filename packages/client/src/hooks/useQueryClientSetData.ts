import { ApiResponse, PaginatedResponse } from '@bupd/types';
import { InfiniteData, useQueryClient } from 'react-query';

export type CacheHitFunction<ResponseData> = (
	queryResponse: ApiResponse<ResponseData> | null | undefined,
	pages?: ApiResponse<ResponseData>[]
) => ApiResponse<ResponseData> | null | undefined;

export function useQueryClientSetData<ResponseData>() {
	const queryClient = useQueryClient();
	return (queryKey: string[], cacheHitCb: CacheHitFunction<ResponseData>) => {
		queryClient.setQueriesData<ApiResponse<ResponseData> | null | undefined>(
			queryKey,
			(queryResponse) => cacheHitCb(queryResponse)
		);
	};
}

export function useQueryClientSetInfiniteData<ResponseData extends PaginatedResponse<any>>() {
	const queryClient = useQueryClient();
	return (queryKey: string[], cacheHitCb: CacheHitFunction<ResponseData>) => {
		queryClient.setQueriesData<InfiniteData<ApiResponse<ResponseData>> | null | undefined>(
			{
				// For infinite queries, we only want to get the cached item where the with the first query key item
				predicate: (query) => query.queryKey[0] === queryKey[0],
			},
			(queryResponse) => {
				if (queryResponse) {
					queryResponse.pages.forEach((page) => {
						cacheHitCb(page, queryResponse.pages);
					});
				}
				return queryResponse;
			}
		);
	};
}
