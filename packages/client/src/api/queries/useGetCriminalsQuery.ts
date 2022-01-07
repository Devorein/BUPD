import { GetCriminalsPayload, ICriminalPopulated, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetCriminalsQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<ICriminalPopulated>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<ICriminalPopulated>>) => {
		queryClientSetData(['criminal'], cacheHitCb);
	};
}

export function useGetCriminalsQuery(query: GetCriminalsPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<ICriminalPopulated, GetCriminalsPayload>(
		['criminal', decodeURIComponent(qs.stringify(clonedQuery))],
		`criminal`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
