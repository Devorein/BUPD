import router from 'next/router';
import { useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';

export function useIsAuthorized(allowedEntities: ('admin' | 'police')[]) {
	const currentUser = useCurrentUser();

	useEffect(() => {
		if (currentUser?.type && !allowedEntities.includes(currentUser.type)) {
			router.push({ pathname: '/login' });
		}
		// eslint-disable-next-line
	}, [currentUser]);

	return null;
}
