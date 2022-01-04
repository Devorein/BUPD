import { UpdatePolicePayload, UpdatePoliceResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetPolicesQueryData } from '../queries/useGetPolicesQuery';

export function useUpdatePoliceMutationCache() {
	const getPolicesQueryData = useGetPolicesQueryData();
	const postMutation = usePostMutation<UpdatePolicePayload, UpdatePoliceResponse>(
		'Successfully updated police',
		"Couldn't update police"
	);

	return (policeNid: number, postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			getPolicesQueryData((page) => {
				if (page?.status === 'success') {
					const policeIndex = page.data.items.findIndex((police) => police.nid === policeNid);
					if (policeIndex !== -1 && page.data.items[policeIndex]) {
						page.data.items[policeIndex] = mutationResponse as any;
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

export function useUpdatePoliceMutation() {
	return useApiMutation<UpdatePoliceResponse, UpdatePolicePayload & { endpoint: string }>(
		['update_police'],
		`police`,
		'PUT'
	);
}
