import { ApiResponse, PaginatedResponse } from '@bupd/types';
import { InfiniteData, useQueryClient } from 'react-query';

export type CacheHitFunction<ResponseData> = (
	queryResponse: ApiResponse<ResponseData> | null | undefined
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
			queryKey,
			(queryResponse) => {
				if (queryResponse) {
					queryResponse.pages.forEach((page) => {
						cacheHitCb(page);
					});
				}
				return queryResponse;
			}
		);
	};
}
