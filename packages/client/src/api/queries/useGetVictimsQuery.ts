import { GetVictimsPayload, IVictim, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetVictimsQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<IVictim>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<IVictim>>) => {
		queryClientSetData(['victim'], cacheHitCb);
	};
}

export function useGetVictimsQuery(query: GetVictimsPayload) {
	const { currentUser } = useContext(RootContext);
	const clonedQuery = JSON.parse(JSON.stringify(query));
	delete clonedQuery.next;
	return useApiInfiniteQuery<IVictim, GetVictimsPayload>(
		['victim', decodeURIComponent(qs.stringify(clonedQuery))],
		`victim`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
