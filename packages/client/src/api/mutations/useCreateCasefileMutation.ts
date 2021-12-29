import { CreateCasefilePayload, CreateCasefileResponse } from '@shared';
import { useApiMutation } from '../../hooks';

export function useCreateCasefileMutation() {
	return useApiMutation<CreateCasefileResponse, CreateCasefilePayload>(['casefile'], 'casefile');
}
