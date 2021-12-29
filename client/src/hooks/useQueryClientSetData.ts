import { ApiResponse, PaginatedResponse } from '@shared';
import { InfiniteData, useQueryClient } from 'react-query';

export type CacheHitFunction<ResponseData> = (
	queryResponse: ApiResponse<ResponseData>
) => ApiResponse<ResponseData>;

export function useQueryClientSetData<ResponseData>() {
	const queryClient = useQueryClient();
	return (queryKey: string[], cacheHitCb: CacheHitFunction<ResponseData>) => {
		queryClient.setQueriesData<ApiResponse<ResponseData> | null | undefined>(
			queryKey,
			(queryResponse) => {
				if (queryResponse) {
					return cacheHitCb(queryResponse);
				}
				return queryResponse;
			}
		);
	};
}

export function useQueryClientSetInfiniteData<Response extends PaginatedResponse<any>>() {
	const queryClient = useQueryClient();
	return (queryKey: string[], cacheHitCb: (queryResponse: Response, pageIndex: number) => void) => {
		queryClient.setQueriesData<InfiniteData<ApiResponse<Response>> | null | undefined>(
			queryKey,
			(queryResponse) => {
				if (queryResponse) {
					queryResponse.pages.forEach((page, index) => {
						if (page.status === 'success') {
							cacheHitCb(page.data, index);
						}
					});
				}
				return queryResponse;
			}
		);
	};
}
