import { ApiResponse, LoginPayload, LoginResponse } from '@shared';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useState } from 'react';
import { UseMutationResult } from 'react-query';
import * as Yup from 'yup';
import { useLoginMutation } from '../api/mutations';
import { Button, FormikTextInput, MultiTabs } from '../components';

const loginInputInitialValue: Omit<LoginPayload, 'as'> = {
  email: '',
  password: '',
};

const loginInputValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

interface FormikFormProps {
  isLoggingIn: boolean
  as: "admin" | "police"
  setIsLoggingIn: Dispatch<SetStateAction<boolean>>
  loginMutation: UseMutationResult<ApiResponse<LoginResponse>, string, LoginPayload, unknown>
}

function FormikForm(props: FormikFormProps) {
  const { as, loginMutation, setIsLoggingIn, isLoggingIn } = props;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  return <Formik
    key="admin"
    validateOnMount
    validationSchema={loginInputValidationSchema}
    initialValues={loginInputInitialValue}
    onSubmit={async (values) => {
      setIsLoggingIn(true);
      try {
        loginMutation.mutate(
          {
            as,
            email: values.email,
            password: values.password,
          },
          {
            onSuccess() {
              router.push('/');
              enqueueSnackbar(`Successfully logged in as ${as}`, { variant: 'success' });
            },
            onError(response) {
              enqueueSnackbar((response as any).message, { variant: 'error' });
            },
          }
        );
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
      setIsLoggingIn(false);
    }}
  >
    {({ isSubmitting, isValid }) => (
      <Form>
        <div className="flex flex-col min-w-[350px]">
          <FormikTextInput
            disabled={isLoggingIn}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
          />
          <FormikTextInput
            disabled={isLoggingIn}
            name="password"
            label="Password"
            placeholder="*****"
            type="password"
          />
        </div>
        <div className="flex justify-between my-5">
          <Button
            content="login"
            type="submit"
            disabled={!isValid || isSubmitting || isLoggingIn}
          />
        </div>
      </Form>
    )}
  </Formik>
}

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginMutation = useLoginMutation();

  return (
    <div className="flex items-center justify-center w-full h-full">
      <MultiTabs
        panels={[
          <FormikForm as='admin' isLoggingIn={isLoggingIn} loginMutation={loginMutation} setIsLoggingIn={setIsLoggingIn} key="admin" />,
          <FormikForm as='police' isLoggingIn={isLoggingIn} loginMutation={loginMutation} setIsLoggingIn={setIsLoggingIn} key="admin" />,
        ]}
        tabs={['admin', 'police']}
      />
    </div>
  );
}
