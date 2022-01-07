import { DeleteVictimPayload, DeleteVictimResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetVictimsQueryData } from '../queries/useGetVictimsQuery';
import { useDeleteMutationCache } from '../utils/useDeleteMutationCache';

export function useDeleteVictimMutationCache() {
	return useDeleteMutationCache('victim', useGetVictimsQueryData);
}

export function useDeleteVictimMutation() {
	return useApiMutation<DeleteVictimResponse, DeleteVictimPayload>(
		['delete_victim'],
		'victim',
		'DELETE'
	);
}
