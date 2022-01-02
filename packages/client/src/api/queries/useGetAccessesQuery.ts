import { GetAccessesPayload, IAccessPopulated, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetAccessesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IAccessPopulated>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IAccessPopulated>>) => {
		queryClientSetData(['access'], cacheHitCb);
	};
}

export function useGetAccessesQuery(query: GetAccessesPayload) {
	const { currentUser } = useContext(RootContext);
	return useApiInfiniteQuery<IAccessPopulated, GetAccessesPayload>(
		['access', qs.stringify(query)],
		`access`,
		query,
		{
			enabled: currentUser?.type === 'admin',
		}
	);
}
