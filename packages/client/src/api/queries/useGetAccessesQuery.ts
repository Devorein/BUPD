import { GetAccessesPayload, IAccess, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export function useGetAccessesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IAccess>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IAccess>>) => {
		queryClientSetData(['access'], cacheHitCb);
	};
}

export function useGetAccessesQuery(query: Partial<GetAccessesPayload>) {
	const currentUser = useCurrentUser();
	return useApiInfiniteQuery<IAccess>(['access', qs.stringify(query)], `access`, {
		enabled: currentUser?.type === 'admin',
	});
}
