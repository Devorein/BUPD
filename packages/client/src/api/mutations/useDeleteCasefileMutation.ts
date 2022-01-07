import { DeleteCasefileResponse, ICasefile } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetCasefilesQueryData } from '../queries/useGetCasefilesQuery';
import { useDeleteMutationCache } from '../utils/useDeleteMutationCache';

export function useDeleteCasefileMutationCache() {
	return useDeleteMutationCache<ICasefile, DeleteCasefileResponse>(
		'casefile',
		useGetCasefilesQueryData,
		'case_no'
	);
}

export function useDeleteCasefileMutation() {
	return useApiMutation<DeleteCasefileResponse, { endpoint: string }>(
		['delete_casefile'],
		'casefile',
		'DELETE'
	);
}
