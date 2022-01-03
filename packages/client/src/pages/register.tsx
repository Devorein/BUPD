import { RegisterPolicePayload } from '@bupd/types';
import { Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useRegisterMutation } from '../api/mutations';
import { Button, FormikTextInput } from '../components';
import { useIsAuthenticated, useIsAuthorized } from '../hooks';

const registerInputInitialValue: RegisterPolicePayload = {
  email: '',
  password: '',
  address: "",
  designation: "",
  name: "",
  nid: 0,
  phone: "",
  rank: ""
};

const registerInputValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  name: Yup.string().required("Required"),
  nid: Yup.number().required("Required"),
  rank: Yup.string().required("Required"),
  phone: Yup.string(),
  designation: Yup.string(),
  address: Yup.string(),
});

export default function Register() {
  useIsAuthenticated();
  useIsAuthorized(["admin"])

  const { enqueueSnackbar } = useSnackbar();
  const registerMutation = useRegisterMutation();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Formik
        validateOnMount
        validationSchema={registerInputValidationSchema}
        initialValues={registerInputInitialValue}
        onSubmit={async (values) => {
          try {
            registerMutation.mutate(
              values,
              {
                onSuccess() {
                  enqueueSnackbar(`Successfully registered as ${values.name}`, { variant: 'success' });
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
          <Form className="p-5 shadow-md rounded-md">
            <div className="underline my-5 text-center uppercase">
              <Typography variant="h4">Register a police</Typography>
            </div>
            <div className="flex flex-col min-w-[450px] max-h-[500px] overflow-auto pr-5">
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
                name="rank"
                label="Rank"
                placeholder="Superintendent"
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
