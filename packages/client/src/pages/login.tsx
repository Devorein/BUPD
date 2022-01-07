import { ApiResponse, GetCurrentUserResponse, LoginPayload, LoginResponse } from '@bupd/types';
import { Form, Formik } from 'formik';
import router from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { UseMutationResult } from 'react-query';
import * as Yup from 'yup';
import { useGetCurrentUserQueryData } from '../api';
import { useLoginMutation } from '../api/mutations';
import { Button, FormikTextInput, MultiTabs } from '../components';
import { JWT_LS_KEY } from '../constants';
import { RootContext } from '../contexts';

const loginInputInitialValue: Omit<LoginPayload, 'as'> = {
	email: '',
	password: '',
};

const loginInputValidationSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required'),
	password: Yup.string().required('Required'),
});

interface FormikFormProps {
	as: 'admin' | 'police';
	loginMutation: UseMutationResult<ApiResponse<LoginResponse>, string, LoginPayload, unknown>;
}

function FormikForm(props: FormikFormProps) {
	const { as, loginMutation } = props;
	const getCurrentUserQueryData = useGetCurrentUserQueryData();
	const { enqueueSnackbar } = useSnackbar();
	return (
		<Formik
			key={as}
			validateOnMount
			validationSchema={loginInputValidationSchema}
			initialValues={loginInputInitialValue}
			onSubmit={async (values) => {
				try {
					loginMutation.mutate(
						{
							as,
							email: values.email,
							password: values.password,
						},
						{
							onSuccess(response) {
								router.push('/');
								if (response.status === 'success') {
									localStorage.setItem(JWT_LS_KEY, response.data.token);
									// Logging the current user
									getCurrentUserQueryData(() => ({
										status: 'success',
										data: {
											type: as,
											...response.data,
										} as unknown as GetCurrentUserResponse,
									}));
									enqueueSnackbar(`Successfully logged in`, { variant: 'success' });
								}
							},
							onError(response) {
								enqueueSnackbar((response as any).message, { variant: 'error' });
							},
						}
					);
				} catch (err: any) {
					enqueueSnackbar(err.message, { variant: 'error' });
				}
			}}
		>
			{({ isSubmitting, isValid }) => (
				<Form className="shadow-md p-5">
					<div className="flex flex-col min-w-[350px]">
						<FormikTextInput
							disabled={loginMutation.isLoading}
							name="email"
							label="Email address"
							placeholder="johndoe@gmail.com"
						/>
						<FormikTextInput
							disabled={loginMutation.isLoading}
							name="password"
							label="Password"
							placeholder="*****"
							type="password"
						/>
					</div>
					<div className="flex justify-between my-5">
						<Button
							color="secondary"
							content="login"
							type="submit"
							disabled={!isValid || isSubmitting || loginMutation.isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default function Login() {
	const loginMutation = useLoginMutation();
	const { currentUser } = useContext(RootContext);

	if (currentUser) {
		router.push({ pathname: '/' });
	}
	return (
		<div className="flex items-center justify-center h-full">
			<MultiTabs
				panels={[
					<FormikForm as="police" loginMutation={loginMutation} key="police" />,
					<FormikForm as="admin" loginMutation={loginMutation} key="admin" />,
				]}
				tabs={['police', 'admin']}
			/>
		</div>
	);
}
