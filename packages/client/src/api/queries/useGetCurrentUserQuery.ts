import { CurrentUser, GetCurrentUserResponse } from '@bupd/types';
import { CacheHitFunction, useApiQuery, useQueryClientSetData } from '../../hooks';

export function useGetCurrentUserQueryData() {
	const queryClientSetData = useQueryClientSetData<CurrentUser>();
	return (cacheHitCb: CacheHitFunction<CurrentUser>) => {
		queryClientSetData(['currentUser'], cacheHitCb);
	};
}

export function useGetCurrentUserQuery() {
	return useApiQuery<GetCurrentUserResponse>(['currentUser'], 'auth/currentUser');
}
