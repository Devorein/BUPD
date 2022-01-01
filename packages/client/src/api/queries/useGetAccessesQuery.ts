import { GetAccessesPayload, IAccess, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetAccessesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IAccess>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IAccess>>) => {
		queryClientSetData(['access'], cacheHitCb);
	};
}

export function useGetAccessesQuery(query: Partial<GetAccessesPayload>) {
	const { currentUser } = useContext(RootContext);
	return useApiInfiniteQuery<IAccess>(['access', qs.stringify(query)], `access`, {
		enabled: currentUser?.type === 'admin',
	});
}
