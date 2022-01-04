import { DeletePoliceResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetPolicesQueryData } from '../queries/useGetPolicesQuery';

export function useDeletePoliceMutationCache() {
	const getPolicesQueryData = useGetPolicesQueryData();
	const postMutation = usePostMutation<any, DeletePoliceResponse>(
		'Successfully deleted police',
		"Couldn't delete police"
	);

	return (policeNid: number, postCacheUpdateCb?: () => void) => {
		return postMutation(() => {
			getPolicesQueryData((page, pages) => {
				if (page?.status === 'success') {
					const policeIndex = page.data.items.findIndex((police) => police.nid === policeNid);
					if (policeIndex !== -1) {
						page.data.items.splice(policeIndex, 1);
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

export function useDeletePoliceMutation() {
	return useApiMutation<DeletePoliceResponse, { endpoint: string }>(
		['delete_police'],
		'police',
		'DELETE'
	);
}
