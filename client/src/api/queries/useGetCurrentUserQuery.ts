import { CurrentUserResponse } from '@shared';
import { JWT_LS_KEY } from '../../constants';
import { CacheHitFunction, useApiQuery, useQueryClientSetData } from '../../hooks';

export function useGetCurrentUserQueryData() {
	const queryClientSetData = useQueryClientSetData<CurrentUserResponse>();
	return (cacheHitCb: CacheHitFunction<CurrentUserResponse>) => {
		queryClientSetData(['currentUser'], cacheHitCb);
	};
}

export function useGetCurrentUserQuery() {
	let jwtToken: null | string = null;
	if (typeof window !== 'undefined') {
		jwtToken = localStorage.getItem(JWT_LS_KEY);
	}
	return useApiQuery<null, CurrentUserResponse>(['currentUser'], 'auth/currentUser', {
		enabled: Boolean(jwtToken),
	});
}
