import router from 'next/router';
import { useContext, useEffect } from 'react';
import { RootContext } from '../contexts';

export function useIsAuthorized(allowedEntities: ('admin' | 'police')[]) {
	const { currentUser } = useContext(RootContext);

	useEffect(() => {
		if (currentUser?.type && !allowedEntities.includes(currentUser.type)) {
			router.push({ pathname: '/login' });
		}
		// eslint-disable-next-line
	}, [currentUser]);

	return null;
}
