import { RegisterPolicePayload, RegisterPoliceResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';

export function useRegisterMutation() {
	return useApiMutation<RegisterPoliceResponse, RegisterPolicePayload>(
		['register'],
		'auth/register'
	);
}
