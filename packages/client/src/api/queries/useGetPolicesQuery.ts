import { GetPolicesPayload, IPolicePopulated, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetPolicesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IPolicePopulated>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IPolicePopulated>>) => {
		queryClientSetData(['police'], cacheHitCb);
	};
}

export function useGetPolicesQuery(query: GetPolicesPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<IPolicePopulated, GetPolicesPayload>(
		['police', decodeURIComponent(qs.stringify(clonedQuery))],
		`police`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
