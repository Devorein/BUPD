import { QueryClient } from 'react-query';

export const createClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				cacheTime: Infinity,
				refetchOnMount: false,
				retry: false,
				refetchOnWindowFocus: false,
			},
		},
	});
