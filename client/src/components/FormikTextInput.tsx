import { FormControl, TextField } from '@mui/material';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';
import { FormLabelWithHelper } from './FormLabelWithHelper';

type FormikTextInputProps = InputHTMLAttributes<HTMLInputElement> & { helperText?: string, name: string, label?: string; placeholder?: string, textarea?: boolean, multiline?: boolean, rows?: number, fullWidth?: boolean };

export function FormikTextInput({ helperText, label, placeholder, multiline = false, rows = 1, fullWidth, ...props }: FormikTextInputProps) {
  const [field, { error }] = useField(props);
  return <FormControl sx={{
    marginTop: { sm: '.5rem', md: '.75rem' },
    marginBottom: { sm: '.5rem', md: '.75rem' }
  }}>
    {label && <FormLabelWithHelper error={error} label={label} name={field.name} />}
    <TextField fullWidth={fullWidth} multiline={multiline} rows={rows} error={Boolean(error)} {...field} {...props} id={field.name} placeholder={placeholder ?? label} variant="outlined" color="primary" size='medium' />
    {helperText && <div className="text-sm mt-1 font-medium text-gray-500">{helperText}</div>}
  </FormControl>;
}