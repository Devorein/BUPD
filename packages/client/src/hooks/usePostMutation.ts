import { ApiResponse } from '@bupd/types';
import { useSnackbar } from 'notistack';
import { MutateOptions } from 'react-query';

export function usePostMutation<Payload, Response>(successMessage?: string, errorMessage?: string) {
	const { enqueueSnackbar } = useSnackbar();

	return (onSuccess: (response: Response, payload: Payload) => void) =>
		({
			onSuccess: (response, payload) => {
				if (response.status === 'success') {
					onSuccess(response.data, payload);
					if (successMessage)
						enqueueSnackbar(successMessage, {
							variant: 'success',
						});
				}
			},
			onError(err) {
				enqueueSnackbar(errorMessage ?? err, {
					variant: 'error',
				});
			},
		} as MutateOptions<ApiResponse<Response>, string, Payload, unknown>);
}
