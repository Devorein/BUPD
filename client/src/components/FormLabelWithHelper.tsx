import { FormHelperText, FormLabel } from "@mui/material";

interface FormLabelWithHelperProps {
  name: string
  label: string
  error?: string | boolean
  className?: string
}

export function FormLabelWithHelper(props: FormLabelWithHelperProps) {
  const { className, name, label, error } = props;

  return <div className={`${className ?? ""} flex justify-between items-center my-1`}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    {Boolean(error) && <FormHelperText className="text-sm mr-0 my-0" error={Boolean(error)}>{error}</FormHelperText>}
  </div>
}