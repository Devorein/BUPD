import { LoginPayload, LoginResponse } from '@shared';
import { useApiMutation } from '../../hooks';

export function useLoginMutation() {
	return useApiMutation<LoginResponse, LoginPayload>(['login'], 'auth/login');
}
