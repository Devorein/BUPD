import { CreateAccessPayload, CreateAccessResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';

export function useCreateAccessMutation() {
	return useApiMutation<CreateAccessResponse, CreateAccessPayload>(['access'], 'access');
}
