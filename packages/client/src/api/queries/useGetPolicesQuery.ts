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

export function useGetPolicesQuery(payload: GetPolicesPayload) {
	const { currentUser } = useContext(RootContext);
	delete (payload as any).next;
	return useApiInfiniteQuery<IPolice, GetPolicesPayload>(
		['police', qs.stringify(payload)],
		`police`,
		payload,
		{
			enabled: currentUser?.type === 'admin',
		}
	);
}
