import { UpdatePoliceProfilePayload, UpdatePoliceProfileResponse } from '@bupd/types';
import { useApiMutation } from '../../hooks/useApiMutation';

export function useUpdatePoliceProfileMutation() {
	return useApiMutation<UpdatePoliceProfileResponse, UpdatePoliceProfilePayload>(
		['update_police_profile'],
		`police`,
		'PUT'
	);
}
