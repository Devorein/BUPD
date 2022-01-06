import { FormikConfig } from 'formik';
import { BaseSchema } from 'yup';

export interface FormProps<Values> {
	initialValues: Values;
	validationSchema: BaseSchema;
	onSubmit: FormikConfig<Values>['onSubmit'];
	showExtra?: boolean;
	isMutationLoading: boolean;
	submitButtonText: string;
	className?: string;
	header: string;
}
