import { ApiResponse, CurrentUserResponse } from '@bupd/types';
import { CacheHitFunction, useApiQuery, useQueryClientSetData } from '../../hooks';

export function useGetCurrentUserQueryData() {
	const queryClientSetData = useQueryClientSetData<CurrentUserResponse>();
	return (cacheHitCb: CacheHitFunction<CurrentUserResponse>) => {
		queryClientSetData(['currentUser'], cacheHitCb);
	};
}

export function useGetCurrentUserQuery() {
	return useApiQuery<ApiResponse<CurrentUserResponse>>(['currentUser'], 'auth/currentUser');
}
