import { GetPolicesPayload, IPolice, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetPolicesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IPolice>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IPolice>>) => {
		queryClientSetData(['police'], cacheHitCb);
	};
}

export function useGetPolicesQuery(query: GetPolicesPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<IPolice, GetPolicesPayload>(
		['police', decodeURIComponent(qs.stringify(clonedQuery))],
		`police`,
		query,
		{
			enabled: currentUser?.type === 'admin',
		}
	);
}
