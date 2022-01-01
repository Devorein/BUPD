import { ApiResponse, PaginatedResponse } from '@bupd/types';
import router from 'next/router';
import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';
import { apiRequest } from '../utils';

export function useApiInfiniteQuery<Item>(
	keys: string[],
	endpoint: string,
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
	>(
		keys,
		async ({ pageParam }) =>
			apiRequest<ApiResponse<PaginatedResponse<Item>>>(
				`${endpoint}?${pageParam ?? router.asPath.slice(2)}`
			),
		{
			...options,
			getNextPageParam: (lastPage) =>
				!lastPage || (lastPage?.status === 'success' && lastPage?.data?.next),
		}
	);

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
