import { UpdateCriminalPayload, UpdateCriminalResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetCriminalsQueryData } from '../queries/useGetCriminalsQuery';
import { useUpdateMutationCache } from '../utils/useUpdateMutationCache';

export function useUpdateCriminalMutationCache() {
	return useUpdateMutationCache('criminal', useGetCriminalsQueryData, 'criminal_id');
}

export function useUpdateCriminalMutation() {
	return useApiMutation<UpdateCriminalResponse, UpdateCriminalPayload & { endpoint: string }>(
		['update_criminal'],
		`criminal`,
		'PUT'
	);
}
