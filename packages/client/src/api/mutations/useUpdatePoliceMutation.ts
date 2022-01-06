import { UpdatePolicePayload, UpdatePoliceResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetPolicesQueryData } from '../queries/useGetPolicesQuery';
import { useUpdateMutationCache } from '../utils/useUpdateMutationCache';

export function useUpdatePoliceMutationCache() {
	return useUpdateMutationCache('police', useGetPolicesQueryData, 'nid');
}

export function useUpdatePoliceMutation() {
	return useApiMutation<UpdatePoliceResponse, UpdatePolicePayload & { endpoint: string }>(
		['update_police'],
		`police`,
		'PUT'
	);
}
