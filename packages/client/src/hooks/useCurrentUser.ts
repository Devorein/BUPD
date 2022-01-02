import { GetCurrentUserResponse } from '@bupd/types';
import { useQueryClient } from 'react-query';

export function useCurrentUser() {
	const queryClient = useQueryClient();
	const currentUserResponse = queryClient.getQueryData<GetCurrentUserResponse>(['currentUser']);
	return currentUserResponse?.status === 'success' ? currentUserResponse.data : null;
}
