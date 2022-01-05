import { IVictim, UpdateVictimPayload, UpdateVictimResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetVictimsQueryData } from '../queries/useGetVictimsQuery';
import { useUpdateMutationCache } from '../utils/useUpdateMutationCache';

export function useUpdateVictimMutationCache() {
	return useUpdateMutationCache<IVictim, UpdateVictimResponse>('victim', useGetVictimsQueryData, 'case_no');
}

export function useUpdateVictimMutation() {
	return useApiMutation<UpdateVictimResponse, UpdateVictimPayload>(
		['update_victim'],
		`victim`,
		'PUT'
	);
}
