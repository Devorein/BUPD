import { ApiResponse, IQuery, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from 'react-query';
import { apiRequest } from '../utils';

export type UseApiInfiniteQuery<Item> = UseInfiniteQueryResult<
	ApiResponse<PaginatedResponse<Item>>,
	Error
> & {
	totalItems: number;
	allItems: Item[];
	lastFetchedPage: ApiResponse<PaginatedResponse<Item>> | null | undefined;
};

export function useApiInfiniteQuery<Item, Payload extends IQuery<any, any>>(
	keys: string[],
	endpoint: string,
	payload?: Payload,
	options?: UseInfiniteQueryOptions<
		ApiResponse<PaginatedResponse<Item>>,
		Error,
		ApiResponse<PaginatedResponse<Item>>,
		ApiResponse<PaginatedResponse<Item>>,
		string[]
	>
): UseApiInfiniteQuery<Item> {
	const infiniteQuery = useInfiniteQuery<
		ApiResponse<PaginatedResponse<Item>>,
		Error,
		ApiResponse<PaginatedResponse<Item>>,
		string[]
	>(
		keys,
		async ({ pageParam }) =>
			apiRequest<ApiResponse<PaginatedResponse<Item>>>(
				`${endpoint}?${qs.stringify(pageParam ?? payload)}`
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
