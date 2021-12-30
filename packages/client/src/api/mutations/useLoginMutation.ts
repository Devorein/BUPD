import { LoginPayload, LoginResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';

export function useLoginMutation() {
	return useApiMutation<LoginResponse, LoginPayload>(['login'], 'auth/login');
}
