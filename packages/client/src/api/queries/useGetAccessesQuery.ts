import { GetAccessesResponse } from '@bupd/types';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useApiQuery, useQueryClientSetData } from '../../hooks';

export function useGetAccessesQueryData() {
	const queryClientSetData = useQueryClientSetData<GetAccessesResponse>();
	return (cacheHitCb: CacheHitFunction<GetAccessesResponse>) => {
		queryClientSetData(['access'], cacheHitCb);
	};
}

export function useGetAccessesQuery(query: string) {
	const { currentUser } = useContext(RootContext);
	return useApiQuery<GetAccessesResponse>(['access', query], `access?${query}`, {
		enabled: currentUser?.type === 'admin',
	});
}
