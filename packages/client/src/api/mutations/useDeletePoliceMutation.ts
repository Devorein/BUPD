import { DeletePoliceResponse, IPolicePopulated } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetPolicesQueryData } from '../queries/useGetPolicesQuery';
import { useDeleteMutationCache } from '../utils/useDeleteMutationCache';

export function useDeletePoliceMutationCache() {
	return useDeleteMutationCache<IPolicePopulated, DeletePoliceResponse>(
		'police',
		useGetPolicesQueryData,
		'nid'
	);
}

export function useDeletePoliceMutation() {
	return useApiMutation<DeletePoliceResponse, { endpoint: string }>(
		['delete_police'],
		'police',
		'DELETE'
	);
}
