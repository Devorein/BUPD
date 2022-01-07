import { PaginatedResponse } from '@bupd/types';
import { usePostMutation } from '../../hooks/usePostMutation';
import { CacheHitFunction } from '../../hooks/useQueryClientSetData';

export function useDeleteMutationCache<Data, Response>(
	entity: 'police' | 'casefile' | 'criminal' | 'victim',
	queryDataGenerator: () => (cacheHitCb: CacheHitFunction<PaginatedResponse<Data>>) => void,
	key?: keyof Data
) {
	const postMutation = usePostMutation<any, Response>(`Successfully deleted ${entity}`);

	const queryData = queryDataGenerator();
	return (identifier: number | ((data: Data) => boolean), postCacheUpdateCb?: () => void) => {
		return postMutation(() => {
			queryData((page, pages) => {
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
						page.data.items.splice(dataIndex, 1);
						const lastPage = pages?.[pages.length - 1];

						// Decrease the count from the last page
						if (lastPage?.status === 'success') {
							lastPage.data.total -= 1;
						}
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
