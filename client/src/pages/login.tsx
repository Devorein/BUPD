import { LoginPayload } from "@shared";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from 'yup';

const loginInputInitialValue: Omit<LoginPayload, "as"> = {
  email: '',
  password: '',
}

const loginInputValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function Login() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const { enqueueSnackbar } = useSnackbar();
  return <div>
    <Formik
      validateOnMount
      validationSchema={loginInputValidationSchema}
      initialValues={loginInputInitialValue} onSubmit={async (values) => {
        setIsLoggingIn(true)
        try {
          await loginWithEmailAndPassword(auth, values.email, values.password);

          router.push("/");
        } catch (err: any) {
          enqueueSnackbar(err.message, { variant: 'error' });
        }
        setIsLoggingIn(false);
      }}>
      {({ isSubmitting, isValid }) => (<Form>
        <FormikTextInput disabled={isLoggingIn} name="email" label="Email address" placeholder="johndoe@gmail.com" />
        <FormikTextInput disabled={isLoggingIn} name="password" label="Password" placeholder="*****" type="password" />
        <div className="flex justify-between">
          <Button content="login" type="submit" disabled={!isValid || isSubmitting || isLoggingIn} />
        </div>
      </Form>)}
    </Formik>
  </div>
}