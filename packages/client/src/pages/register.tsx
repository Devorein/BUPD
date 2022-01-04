import { POLICE_RANKS } from '@bupd/constants';
import { RegisterPolicePayload } from '@bupd/types';
import { PoliceRequest } from '@bupd/validation';
import { Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useRegisterMutation } from '../api/mutations';
import { Button, FormikSelectInput, FormikTextInput } from '../components';
import { useIsAuthenticated, useIsAuthorized } from '../hooks';

const registerInputInitialValue: RegisterPolicePayload = {
  email: '',
  password: '',
  address: "",
  designation: "",
  name: "",
  nid: 10000,
  phone: "",
  rank: ""
};

export default function Register() {
  useIsAuthenticated();
  useIsAuthorized(["admin"])

  const { enqueueSnackbar } = useSnackbar();
  const registerMutation = useRegisterMutation();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Formik
        validateOnMount
        validationSchema={PoliceRequest.create("client")}
        initialValues={registerInputInitialValue}
        onSubmit={async (values, { resetForm }) => {
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
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="p-5 shadow-md rounded-md h-full border-2">
            <div className="underline my-5 text-center uppercase">
              <Typography variant="h4">Register a police</Typography>
            </div>
            <div className="flex flex-col min-w-[450px] overflow-auto pr-5" style={{
              height: 'calc(100% - 135px)'
            }}>
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="name"
                label="Full name"
                placeholder="John Doe"
              />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
              />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="password"
                label="Password"
                placeholder="*****"
                type="password"
              />
              <FormikSelectInput<string> defaultValue={POLICE_RANKS[0]} items={POLICE_RANKS} label="Rank" name="rank" />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="phone"
                label="Phone"
                placeholder="+880..."
              />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="designation"
                label="Designation"
                placeholder="Police Station"
              />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="nid"
                label="NID"
                placeholder="123456"
                type="number"
              />
              <FormikTextInput
                disabled={registerMutation.isLoading}
                name="address"
                label="Address"
                placeholder="Road 123"
                multiline
                rows={2}
              />
            </div>
            <div className="flex justify-between my-5">
              <Button
                color="secondary"
                content="Register"
                type="submit"
                disabled={!isValid || isSubmitting || registerMutation.isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
