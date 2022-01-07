import { CreateAccessPayload, CreateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetCasefilesQueryData } from '../queries/useGetCasefilesQuery';
import { useGetCriminalsQueryData } from '../queries/useGetCriminalsQuery';

export function useCreateAccessMutationCache(entity: 'casefile' | 'criminal') {
	const postMutation = usePostMutation<CreateAccessPayload, CreateAccessResponse>();

	const casefilesQueryData = useGetCasefilesQueryData();
	const criminalsQueryData = useGetCriminalsQueryData();

	return (id: number, successMessage: string, postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			if (entity === 'casefile') {
				casefilesQueryData((page) => {
					if (page?.status === 'success') {
						const casefileIndex = page.data.items.findIndex((casefile) => casefile.case_no === id);

						if (casefileIndex !== -1) {
							const casefile = page.data.items[casefileIndex]!;
							if (!casefile.permissions) {
								casefile.permissions = {
									[mutationResponse.permission]: 2,
								};
							} else {
								casefile.permissions[mutationResponse.permission] = 2;
							}
						}
					}
					return page;
				});
			} else {
				criminalsQueryData((page) => {
					if (page?.status === 'success') {
						const criminalIndex = page.data.items.findIndex(
							(criminal) => criminal.criminal_id === id
						);

						if (criminalIndex !== -1) {
							const criminal = page.data.items[criminalIndex]!;
							if (!criminal.permissions) {
								criminal.permissions = {
									[mutationResponse.permission]: 2,
								};
							} else {
								criminal.permissions[mutationResponse.permission] = 2;
							}
						}
					}
					return page;
				});
			}
			if (postCacheUpdateCb) {
				postCacheUpdateCb();
			}
		}, successMessage);
	};
}

export function useCreateAccessMutation() {
	return useApiMutation<CreateAccessResponse, CreateAccessPayload>(['access'], 'access');
}
