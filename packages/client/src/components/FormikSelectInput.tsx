
import { FormControl, SelectProps as MuiSelectProps } from "@mui/material";
import { useField } from 'formik';
import React, { SelectHTMLAttributes } from 'react';
import { FormLabelWithHelper } from './FormLabelWithHelper';
import { Select, SelectProps } from './Select';

type FormikSelectInputProps<Value> = SelectHTMLAttributes<HTMLSelectElement> & { defaultValue?: Value, items: SelectProps<Value>["items"], renderValue?: SelectProps<Value>["renderValue"], menuItemRender?: SelectProps<Value>["menuItemRender"], name: string, label: string };

export function FormikSelectInput<Value extends (string | string[]) = string>({ defaultValue, items, label, ...props }: FormikSelectInputProps<Value>) {
  const [field, { error }, { setValue }] = useField(props);
  return <FormControl className="FormikTextInput" >
    <FormLabelWithHelper error={error} label={label} name={field.name} />
    <Select<Value> defaultValue={defaultValue} items={items} value={field.value} {...props as MuiSelectProps<Value>} onChange={(e) => {
      setValue(e.target.value)
    }} />
  </FormControl>;
}