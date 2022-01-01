import { GetAccessesResponse, IAccess, IQuery } from '@bupd/types';
import router from 'next/router';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetAccessesQueryData() {
	const queryClientSetData = useQueryClientSetData<GetAccessesResponse>();
	return (cacheHitCb: CacheHitFunction<GetAccessesResponse>) => {
		queryClientSetData(['access'], cacheHitCb);
	};
}

export function useGetAccessesQuery() {
	const { currentUser } = useContext(RootContext);
	const query = qs.parse(router.asPath.slice(2)) as unknown as Partial<IQuery<any, any>>;
	// Next should not be part of query key
	if (query) {
		delete query.next;
	}

	return useApiInfiniteQuery<IAccess>(['access', qs.stringify(query)], `access`, {
		enabled: currentUser?.type === 'admin',
	});
}
