import { FormControl, TextField } from '@mui/material';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';
import { FormLabelWithHelper } from './FormLabelWithHelper';

type FormikTextInputProps = InputHTMLAttributes<HTMLInputElement> & { helperText?: string, name: string, label?: string; placeholder?: string | number, textarea?: boolean, multiline?: boolean, rows?: number, fullWidth?: boolean, rightIcon?: JSX.Element };

export function FormikTextInput({ helperText, label, placeholder, multiline = false, rows = 1, fullWidth, rightIcon, ...props }: FormikTextInputProps) {
  const [field, { error }] = useField(props);
  return <FormControl className="w-full" sx={{
    marginTop: '.5rem',
    marginBottom: '.5rem'
  }}>
    {label && <FormLabelWithHelper error={error} label={label} name={field.name} />}
    <div className="flex gap-2 items-center w-full">
      <TextField fullWidth={fullWidth ?? true} multiline={multiline} rows={rows} error={Boolean(error)} {...field} {...props} id={field.name} placeholder={placeholder ?? label} variant="outlined" color="primary" size='medium' />
      {rightIcon}
    </div>
    {helperText && <div className="text-sm mt-1 font-medium text-gray-500">{helperText}</div>}
  </FormControl>;
}