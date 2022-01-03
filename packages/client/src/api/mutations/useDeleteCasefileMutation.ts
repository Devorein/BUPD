import { DeleteCasefileResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetCasefilesQueryData } from '../queries/useGetCasefilesQuery';

export function useDeleteCasefileMutationCache() {
	const getAccessesQueryData = useGetCasefilesQueryData();
	const postMutation = usePostMutation<any, DeleteCasefileResponse>(
		'Successfully deleted casefile',
		"Couldn't delete casefile"
	);

	return (caseNo: number, postCacheUpdateCb?: () => void) => {
		return postMutation(() => {
			getAccessesQueryData((page, pages) => {
				if (page?.status === 'success') {
					const policeIndex = page.data.items.findIndex((casefile) => casefile.case_no === caseNo);
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

export function useDeleteCasefileMutation() {
	return useApiMutation<DeleteCasefileResponse, { endpoint: string }>(
		['delete_casefile'],
		'casefile',
		'DELETE'
	);
}
