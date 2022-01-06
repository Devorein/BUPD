import { CreateAccessPayload, CreateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { usePostMutation } from '../../hooks/usePostMutation';
import { useGetCasefilesQueryData } from '../queries/useGetCasefilesQuery';

export function useCreateAccessMutationCache() {
	const postMutation = usePostMutation<CreateAccessPayload, CreateAccessResponse>();

	const casefilesQueryData = useGetCasefilesQueryData();

	return (caseNo: number, successMessage: string, postCacheUpdateCb?: () => void) => {
		return postMutation((mutationResponse) => {
			casefilesQueryData((page) => {
				if (page?.status === 'success') {
					const casefileIndex = page.data.items.findIndex(
						(casefile) => casefile.case_no === caseNo
					);

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
			if (postCacheUpdateCb) {
				postCacheUpdateCb();
			}
		}, successMessage);
	};
}

export function useCreateAccessMutation() {
	return useApiMutation<CreateAccessResponse, CreateAccessPayload>(['access'], 'access');
}
