
import { FormControl, SelectProps as MuiSelectProps, useTheme } from "@mui/material";
import { useField } from 'formik';
import React, { SelectHTMLAttributes } from 'react';
import { FormLabelWithHelper } from './FormLabelWithHelper';
import { Select, SelectProps } from './Select';

type FormikSelectInputProps<Value> = SelectHTMLAttributes<HTMLSelectElement> & { defaultValue?: Value, items: SelectProps<Value>["items"], renderValue?: SelectProps<Value>["renderValue"], menuItemRender?: SelectProps<Value>["menuItemRender"], name: string, label: string };

function Tags<Value extends (string | string[] | number | number[])>(props: { values: Value }) {
  const theme = useTheme();
  if (Array.isArray(props.values)) {
    return <div className="flex gap-2 flex-wrap overflow-auto">{props.values.map(value => <span key={value} className={`px-2 py-1 rounded-sm text-white font-normal`} style={{ background: theme.palette.primary.main }}>{value}</span>)}</div>
  }
  return <span className={`px-2 py-1 rounded-sm text-white font-normal`} style={{ background: theme.palette.primary.main }}>{props.values}</span>
}

export function FormikSelectInput<Value extends (string | string[] | number | number[]) = string>({ defaultValue, items, label, ...props }: FormikSelectInputProps<Value>) {
  const [field, { error }, { setValue }] = useField(props);
  return <FormControl className="FormikTextInput" >
    <FormLabelWithHelper error={error} label={label} name={field.name} />
    <Select<Value> renderValue={(renderValues) => <Tags values={renderValues} />} defaultValue={defaultValue} items={items} value={field.value} {...props as MuiSelectProps<Value>} onChange={(e) => {
      setValue(e.target.value)
    }} />
  </FormControl>;
}