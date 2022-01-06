import { GetCurrentUserResponse } from '@bupd/types';
import router from 'next/router';
import { useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { RootContext } from '../contexts';

export function useIsAuthenticated() {
	const queryClient = useQueryClient();
	const { currentUser } = useContext(RootContext);

	useEffect(() => {
		const queryState = queryClient.getQueryState<GetCurrentUserResponse>(['currentUser']);
		if (queryState && !queryState.isFetching && queryState.data?.status === 'error') {
			router.push({ pathname: '/login' });
		}
	}, [queryClient]);
	return currentUser!;
}
