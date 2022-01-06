import { FormikConfig } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { BaseSchema } from 'yup';

export interface FormProps<Values> {
	initialValues: Values;
	validationSchema: BaseSchema;
	onSubmit: FormikConfig<Values>['onSubmit'];
	isMutationLoading: boolean;
	submitButtonText: string;
	className?: string;
	header: string;
}

export interface FormElementProps<State> {
  setState: Dispatch<SetStateAction<State>>
  state: State
  stateKey: keyof State
  label: string
}