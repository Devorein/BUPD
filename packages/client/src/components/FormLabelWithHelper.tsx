import { FormHelperText, FormLabel } from '@mui/material';

interface FormLabelWithHelperProps {
	name: string;
	label: string;
	error?: string | boolean;
	className?: string;
}

export function FormLabelWithHelper(props: FormLabelWithHelperProps) {
	const { className, name, label, error } = props;

	return (
		<div className={`${className ?? ''} flex justify-between items-center my-1 capitalize`}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			{Boolean(error) && <FormHelperText error={Boolean(error)}>{error}</FormHelperText>}
		</div>
	);
}
