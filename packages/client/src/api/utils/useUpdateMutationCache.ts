import { PaginatedResponse } from '@bupd/types';
import { usePostMutation } from '../../hooks/usePostMutation';
import { CacheHitFunction } from '../../hooks/useQueryClientSetData';

export function useUpdateMutationCache<Data, Response>(
	queryDataGenerator: () => (cacheHitCb: CacheHitFunction<PaginatedResponse<Data>>) => void,
	key: keyof Data
) {
	const postMutation = usePostMutation<any, Response>();

	const queryData = queryDataGenerator();
	return (identifier: number | ((data: Data) => boolean), postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			queryData((page) => {
				if (page?.status === 'success') {
					const dataIndex = page.data.items.findIndex(
						typeof identifier === 'function'
							? identifier
							: (data) => (data[key] as unknown as number) === identifier
					);
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
