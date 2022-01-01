import { CurrentUserResponse } from '@bupd/types';
import router from 'next/router';
import { useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { RootContext } from '../contexts';

export function useIsAuthenticated() {
	const { currentUser } = useContext(RootContext);
	const queryClient = useQueryClient();

	useEffect(() => {
		// If current user doesn't exist even after fetching currentUser or data is undefined
		if (!currentUser) {
			const queryState = queryClient.getQueryState<CurrentUserResponse>(['currentUser']);
			if (queryState && !queryState.isFetching && queryState.status === 'error') {
				router.push('/login');
			}
		}
	}, [currentUser, queryClient]);
	return currentUser;
}
