import { RegisterPolicePayload } from '@bupd/types';
import { PoliceRequest } from '@bupd/validation';
import { useSnackbar } from 'notistack';
import { useRegisterMutation } from '../api/mutations';
import { PoliceForm } from '../components/PoliceForm';
import { useIsAuthenticated, useIsAuthorized } from '../hooks';

const registerInputInitialValue = (): RegisterPolicePayload => ({
  email: '',
  password: '',
  address: "",
  designation: "",
  name: "",
  nid: 10000,
  phone: "",
  rank: ""
});

const createPolicePayloadValidationSchema = PoliceRequest.create("client");


export default function Register() {
  useIsAuthenticated();
  useIsAuthorized(["admin"])

  const { enqueueSnackbar } = useSnackbar();
  const registerMutation = useRegisterMutation();

  return <PoliceForm initialValues={registerInputInitialValue()} isMutationLoading={registerMutation.isLoading} onSubmit={async (values, { resetForm }) => {
    try {
      registerMutation.mutate(
        values,
        {
          onSuccess() {
            enqueueSnackbar(`Successfully registered ${values.name}`, { variant: 'success' });
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
  }} validationSchema={createPolicePayloadValidationSchema} />
}
