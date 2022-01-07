import { DeleteCriminalResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetCriminalsQueryData } from '../queries/useGetCriminalsQuery';
import { useDeleteMutationCache } from '../utils/useDeleteMutationCache';

export function useDeleteCriminalMutationCache() {
	return useDeleteMutationCache('criminal', useGetCriminalsQueryData, 'criminal_id');
}

export function useDeleteCriminalMutation() {
	return useApiMutation<DeleteCriminalResponse, { endpoint: string }>(
		['delete_criminal'],
		'criminal',
		'DELETE'
	);
}
