import { DeleteCriminalResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetCriminalsQueryData } from '../queries/useGetCriminalsQuery';

export function useDeleteCriminalMutationCache() {
	const getCriminalsQueryData = useGetCriminalsQueryData();
	const postMutation = usePostMutation<any, DeleteCriminalResponse>(
		'Successfully deleted criminal',
		"Couldn't delete criminal"
	);

	return (criminalId: number, postCacheUpdateCb?: () => void) => {
		return postMutation(() => {
			getCriminalsQueryData((page, pages) => {
				if (page?.status === 'success') {
					const criminalIndex = page.data.items.findIndex(
						(criminal) => criminal.criminal_id === criminalId
					);
					if (criminalIndex !== -1) {
						page.data.items.splice(criminalIndex, 1);
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

export function useDeleteCriminalMutation() {
	return useApiMutation<DeleteCriminalResponse, { endpoint: string }>(
		['delete_criminal'],
		'criminal',
		'DELETE'
	);
}
