import { IPolice, UpdatePoliceProfilePayload } from '@bupd/types';
import { PoliceRequest } from '@bupd/validation';
import { useSnackbar } from 'notistack';
import { useUpdatePoliceProfileMutation } from '../api/mutations/useUpdatePoliceProfileMutation';
import { useGetCurrentUserQueryData } from '../api/queries/useGetCurrentUserQuery';
import { PoliceForm } from '../components/PoliceForm';
import { JWT_LS_KEY } from '../constants';
import { useIsAuthenticated, useIsAuthorized } from '../hooks';

export default function Account() {
  const currentUser = useIsAuthenticated();
  useIsAuthorized(['police']);
  const updatePoliceProfileMutation = useUpdatePoliceProfileMutation();
  const { enqueueSnackbar } = useSnackbar();
  const getCurrentUserQueryData = useGetCurrentUserQueryData();

  return currentUser ? (
    <div className="flex items-center justify-center w-full h-full">
      <PoliceForm<UpdatePoliceProfilePayload>
        showNewPassword
        showPassword
        showNid={false}
        className="max-w-[450px]"
        header="Update your account"
        submitButtonText="Update"
        initialValues={{ ...(currentUser as (IPolice & { type: "police" })), new_password: '' }}
        isMutationLoading={updatePoliceProfileMutation.isLoading}
        onSubmit={async (values, { resetForm }) => {
          try {
            updatePoliceProfileMutation.mutate(values, {
              onSuccess(response) {
                if (response.status === 'success') {
                  enqueueSnackbar(`Successfully updated`, { variant: 'success' });
                  getCurrentUserQueryData((currentUserQueryData) => {
                    if (currentUserQueryData?.status === 'success') {
                      currentUserQueryData.data = {
                        type: 'police',
                        ...response.data,
                      };
                    }
                    return currentUserQueryData;
                  });
                  resetForm({
                    values: {
                      ...response.data,
                      password: '',
                    },
                  });
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(JWT_LS_KEY, response.data.token);
                  }
                }
              },
              onError(response) {
                enqueueSnackbar((response as any).message, { variant: 'error' });
              },
            });
          } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        }}
        validationSchema={PoliceRequest.updateProfile('client')}
      />
    </div>
  ) : null;
}
