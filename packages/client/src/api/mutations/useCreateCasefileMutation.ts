import { CreateCasefilePayload, CreateCasefileResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks';

export function useCreateCasefileMutation() {
	return useApiMutation<CreateCasefileResponse, CreateCasefilePayload>(['casefile'], 'casefile');
}
