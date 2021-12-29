import { RegisterPolicePayload, RegisterPoliceResponse } from '@shared';
import { useApiMutation } from '../../hooks';

export function useRegisterMutation() {
	return useApiMutation<RegisterPoliceResponse, RegisterPolicePayload>(
		['register'],
		'auth/register'
	);
}
