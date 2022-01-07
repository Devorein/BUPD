import { IPolice, UpdatePoliceProfilePayload } from "@bupd/types";
import { PoliceRequest } from "@bupd/validation";
import { useSnackbar } from "notistack";
import { useUpdatePoliceProfileMutation } from "../api/mutations/useUpdatePoliceProfileMutation";
import { PoliceForm } from "../components/PoliceForm";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

export default function Account() {
  const currentUser = useIsAuthenticated();
  useIsAuthorized(["police"])
  const updatePoliceProfileMutation = useUpdatePoliceProfileMutation();
  const { enqueueSnackbar } = useSnackbar();

  return currentUser ? <div className="flex items-center justify-center w-full h-full">
    <PoliceForm<UpdatePoliceProfilePayload> showNewPassword showPassword showNid={false} className="max-w-[450px]" header="Update your account" submitButtonText="Update" initialValues={{ ...currentUser as IPolice, new_password: "" }} isMutationLoading={updatePoliceProfileMutation.isLoading} onSubmit={async (values, { resetForm }) => {
      try {
        updatePoliceProfileMutation.mutate(
          values,
          {
            onSuccess() {
              enqueueSnackbar(`Successfully updated`, { variant: 'success' });
              resetForm()
            },
            onError(response) {
              enqueueSnackbar((response as any).message, { variant: 'error' });
            }
          }
        );
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }} validationSchema={PoliceRequest.updateProfile("client")} />
  </div> : null
}