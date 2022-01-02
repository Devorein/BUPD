import { GetCurrentUserResponse } from '@bupd/types';
import router from 'next/router';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useCurrentUser } from './useCurrentUser';

export function useIsAuthenticated() {
	const queryClient = useQueryClient();
	const currentUser = useCurrentUser();

	useEffect(() => {
		if (!currentUser) {
			const queryState = queryClient.getQueryState<GetCurrentUserResponse>(['currentUser']);

			if (queryState && !queryState.isFetching && queryState.data?.status === 'error') {
				router.push({ pathname: '/login' });
			}
		}
	}, [currentUser, queryClient]);
	return currentUser;
}
