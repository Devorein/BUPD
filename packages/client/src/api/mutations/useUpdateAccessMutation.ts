import { UpdateAccessPayload, UpdateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';

export function useUpdateAccessMutation(accessId: number) {
	return useApiMutation<UpdateAccessResponse, UpdateAccessPayload>(
		['access', accessId.toString()],
		`access/${accessId}`,
		'PUT'
	);
}
