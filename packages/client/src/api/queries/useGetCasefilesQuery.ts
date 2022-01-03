import { GetCasefilesPayload, ICasefile, PaginatedResponse } from '@bupd/types';
import qs from 'qs';
import { useContext } from 'react';
import { RootContext } from '../../contexts';
import { CacheHitFunction, useQueryClientSetInfiniteData } from '../../hooks';
import { useApiInfiniteQuery } from '../../hooks/useApiInfiniteQuery';

export function useGetCasefilesQueryData() {
	const queryClientSetData = useQueryClientSetInfiniteData<PaginatedResponse<ICasefile>>();
	return (cacheHitCb: CacheHitFunction<PaginatedResponse<ICasefile>>) => {
		queryClientSetData(['casefile'], cacheHitCb);
	};
}

export function useGetCasefilesQuery(query: GetCasefilesPayload) {
	const { currentUser } = useContext(RootContext);
	delete (query as any).next;
	return useApiInfiniteQuery<ICasefile, GetCasefilesPayload>(
		['casefile', qs.stringify(query)],
		`casefile`,
		query,
		{
			enabled: Boolean(currentUser),
		}
	);
}
