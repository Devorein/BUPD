/* eslint-disable arrow-body-style */

import { UpdateAccessPayload, UpdateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetAccessesQueryData } from '../queries/useGetAccessesQuery';

export function useUpdateAccessMutationCache() {
	const getAccessesQueryData = useGetAccessesQueryData();
	const postMutation = usePostMutation<UpdateAccessPayload, UpdateAccessResponse>(
		'Successfully updated access',
		"Couldn't updated access"
	);

	return (accessId: number, postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			getAccessesQueryData((page) => {
				if (page?.status === 'success') {
					const accessIndex = page.data.items.findIndex((access) => access.access_id === accessId);
					if (accessIndex !== -1) {
						page.data.items[accessIndex] = mutationResponse;
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

export function useUpdateAccessMutation(accessId: number) {
	return useApiMutation<UpdateAccessResponse, UpdateAccessPayload>(
		['access', accessId.toString()],
		`access/${accessId}`,
		'PUT'
	);
}
