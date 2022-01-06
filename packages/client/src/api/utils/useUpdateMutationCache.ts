import { PaginatedResponse } from '@bupd/types';
import { usePostMutation } from '../../hooks/usePostMutation';
import { CacheHitFunction } from '../../hooks/useQueryClientSetData';

export function useUpdateMutationCache<Data, Response>(
	entity: 'police' | 'casefile' | 'criminal' | 'victim' | 'access',
	queryDataGenerator: () => (cacheHitCb: CacheHitFunction<PaginatedResponse<Data>>) => void,
	key?: keyof Data
) {
	const postMutation = usePostMutation<any, Response>(`Successfully updated ${entity}`);

	const queryData = queryDataGenerator();

	return (identifier: number | ((data: Data) => boolean), postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			queryData((page) => {
				if (page?.status === 'success') {
					let dataIndex = -1;
					if (typeof identifier === 'function') {
						dataIndex = page.data.items.findIndex(identifier);
					} else if (key) {
						dataIndex = page.data.items.findIndex(
							(data) => (data[key] as unknown as number) === identifier
						);
					}
					if (dataIndex !== -1) {
						page.data.items[dataIndex] = {
							...page.data.items[dataIndex]!,
							...mutationResponse,
						};
					}
				}
				return page;
			});
			if (postCacheUpdateCb) {
				postCacheUpdateCb();
			}
		});
	};
}
