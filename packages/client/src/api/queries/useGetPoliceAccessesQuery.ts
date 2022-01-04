import { GetPoliceAccessesPayload, IAccess, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetPoliceAccessesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IAccess>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IAccess>>) => {
		queryClientSetData(['police/access'], cacheHitCb);
	};
}

export function useGetPoliceAccessesQuery(query: GetPoliceAccessesPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<IAccess, GetPoliceAccessesPayload>(
		['police/access', decodeURIComponent(qs.stringify(clonedQuery))],
		`police/access`,
		query,
		{
			enabled: currentUser?.type === 'police',
		}
	);
}
