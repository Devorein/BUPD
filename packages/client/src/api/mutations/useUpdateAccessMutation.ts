/* eslint-disable arrow-body-style */

import { UpdateAccessPayload, UpdateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';
import { useGetAccessesQueryData } from '../queries/useGetAccessesQuery';
import { useUpdateMutationCache } from '../utils/useUpdateMutationCache';

export function useUpdateAccessMutationCache() {
	return useUpdateMutationCache(useGetAccessesQueryData, 'access_id');
}

export function useUpdateAccessMutation(accessId: number) {
	return useApiMutation<UpdateAccessResponse, UpdateAccessPayload>(
		['access', accessId.toString()],
		`access/${accessId}`,
		'PUT'
	);
}
