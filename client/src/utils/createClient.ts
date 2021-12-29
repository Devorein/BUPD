import { QueryClient } from 'react-query';

export const createClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				cacheTime: Infinity,
				refetchOnMount: false,
				retry: false,
			},
		},
	});
};
