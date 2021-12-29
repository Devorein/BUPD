import { Typography } from '@mui/material';
import { RegisterPolicePayload } from '@shared';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import * as Yup from 'yup';
import { useRegisterMutation } from '../api/mutations';
import { Button, FormikTextInput } from '../components';

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
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isRegistering, setIsRegistering] = useState(false);
  const registerMutation = useRegisterMutation();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Formik
        validateOnMount
        validationSchema={registerInputValidationSchema}
        initialValues={registerInputInitialValue}
        onSubmit={async (values) => {
          setIsRegistering(true);
          try {
            registerMutation.mutate(
              values,
              {
                onSuccess() {
                  router.push('/');
                  enqueueSnackbar(`Successfully registered as ${values.name}`, { variant: 'success' });
                },
                onError(response) {
                  enqueueSnackbar((response as any).message, { variant: 'error' });
                },
                onSettled() {
                  setIsRegistering(false);
                }
              }
            );
          } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' });
            setIsRegistering(false);
          }
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <div className="my-3 text-center">
              <Typography variant="h4">Register a police</Typography>
            </div>
            <div className="flex flex-col min-w-[450px] max-h-[500px] overflow-auto pr-5">
              <FormikTextInput
                disabled={isRegistering}
                name="name"
                label="Full name"
                placeholder="John Doe"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="password"
                label="Password"
                placeholder="*****"
                type="password"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="phone"
                label="Phone"
                placeholder="+880..."
              />
              <FormikTextInput
                disabled={isRegistering}
                name="designation"
                label="Designation"
                placeholder="Police Station"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="nid"
                label="NID"
                placeholder="123456"
                type="number"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="rank"
                label="Rank"
                placeholder="Superintendent"
              />
              <FormikTextInput
                disabled={isRegistering}
                name="address"
                label="Address"
                placeholder="Road 123"
                multiline
                rows={2}
              />
            </div>
            <div className="flex justify-between my-5">
              <Button
                content="Register"
                type="submit"
                disabled={!isValid || isSubmitting || isRegistering}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
