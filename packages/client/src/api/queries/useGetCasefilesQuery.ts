import { GetCasefilesPayload, ICasefilePopulated, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetCasefilesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<ICasefilePopulated>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<ICasefilePopulated>>) => {
		queryClientSetData(['casefile'], cacheHitCb);
	};
}

export function useGetCasefilesQuery(query: GetCasefilesPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<ICasefilePopulated, GetCasefilesPayload>(
		['casefiles', decodeURIComponent(qs.stringify(clonedQuery))],
		`casefile`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
