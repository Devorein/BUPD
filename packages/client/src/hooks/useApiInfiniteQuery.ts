import { ApiResponse, IQuery, PaginatedResponse } from '@bupd/types';
import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { apiRequest } from '../utils';

export function useInfiniteQueryApi<Item, Query extends IQuery<any, any>>(
	keys: string[],
	endpoint: string,
	query?: Query | null,
	options?: UseInfiniteQueryOptions<
		ApiResponse<PaginatedResponse<Item>>,
		Error,
		ApiResponse<PaginatedResponse<Item>>,
		ApiResponse<PaginatedResponse<Item>>,
		string[]
	>
) {
	const infiniteQuery = useInfiniteQuery<
		ApiResponse<PaginatedResponse<Item>>,
		Error,
		ApiResponse<PaginatedResponse<Item>>,
		string[]
	>(keys, async () => apiRequest<ApiResponse<PaginatedResponse<Item>>>(endpoint), {
		...options,
		getNextPageParam: (lastPage) =>
			!lastPage || (lastPage?.status === 'success' && lastPage?.data?.next),
	});

	const totalItems =
		infiniteQuery.data && infiniteQuery.data.pages[0]?.status === 'success'
			? infiniteQuery.data.pages[0].data?.total ?? 0
			: 0;
	const allItems: Item[] = [];
	infiniteQuery.data?.pages.forEach((page) => {
		if (page.status === 'success') {
			allItems.push(...(page.data?.items ?? []));
		}
	});
	const lastFetchedPage =
		infiniteQuery.data && infiniteQuery.data.pages
			? infiniteQuery.data.pages[infiniteQuery.data.pages.length - 1]
			: null;

	return {
		...infiniteQuery,
		totalItems,
		allItems,
		lastFetchedPage,
	};
}
