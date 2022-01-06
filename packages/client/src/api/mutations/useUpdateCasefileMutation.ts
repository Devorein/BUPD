import { UpdateCasefilePayload, UpdateCasefileResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetCasefilesQueryData } from '../queries/useGetCasefilesQuery';
import { useUpdateMutationCache } from '../utils/useUpdateMutationCache';

export function useUpdateCasefileMutationCache() {
	return useUpdateMutationCache('casefile', useGetCasefilesQueryData, 'case_no');
}

export function useUpdateCasefileMutation() {
	return useApiMutation<UpdateCasefileResponse, UpdateCasefilePayload & { endpoint: string }>(
		['update_casefile'],
		`casefile`,
		'PUT'
	);
}
