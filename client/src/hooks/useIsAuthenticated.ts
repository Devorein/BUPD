import router from 'next/router';
import { useContext, useEffect } from 'react';
import { RootContext } from '../contexts';

export function useIsAuthenticated() {
	const { currentUser } = useContext(RootContext);

	useEffect(() => {
		if (!currentUser) {
			router.push('/login');
		}
	}, [currentUser]);
	return currentUser;
}
