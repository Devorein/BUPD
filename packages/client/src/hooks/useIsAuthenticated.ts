import { GetCurrentUserResponse } from '@bupd/types';
import router from 'next/router';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export function useIsAuthenticated() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const queryState = queryClient.getQueryState<GetCurrentUserResponse>(['currentUser']);
		console.log({ queryState });
		if (queryState && !queryState.isFetching && queryState.data?.status === 'error') {
			router.push({ pathname: '/login' });
		}
	}, [queryClient]);
}
