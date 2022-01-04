import { GetCasefilesPayload, ICasefile, ICasefilePopulated, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetCasefilesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<ICasefile>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<ICasefile>>) => {
		queryClientSetData(['casefile'], cacheHitCb);
	};
}

export function useGetCasefilesQuery(query: GetCasefilesPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<ICasefilePopulated, GetCasefilesPayload>(
		['casefile', decodeURIComponent(qs.stringify(clonedQuery))],
		`casefile`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
