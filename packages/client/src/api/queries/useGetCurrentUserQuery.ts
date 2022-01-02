import { GetCurrentUserResponse } from '@bupd/types';
import { CacheHitFunction, useApiQuery, useQueryClientSetData } from '../../hooks';

export function useGetCurrentUserQueryData() {
	const queryClientSetData = useQueryClientSetData<GetCurrentUserResponse>();
	return (cacheHitCb: CacheHitFunction<GetCurrentUserResponse>) => {
		queryClientSetData(['currentUser'], cacheHitCb);
	};
}

export function useGetCurrentUserQuery() {
	return useApiQuery<GetCurrentUserResponse>(['currentUser'], 'auth/currentUser');
}
