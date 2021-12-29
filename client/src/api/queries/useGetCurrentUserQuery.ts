import { CurrentUserResponse } from '@shared';
import { JWT_LS_KEY } from '../../constants';
import { useApiQuery } from '../../hooks';

export function useGetCurrentUserQuery() {
	let jwtToken: null | string = null;
	if (typeof window !== 'undefined') {
		jwtToken = localStorage.getItem(JWT_LS_KEY);
	}
	return useApiQuery<null, CurrentUserResponse>(['currentUser'], 'auth/currentUser', {
		enabled: Boolean(jwtToken),
	});
}
