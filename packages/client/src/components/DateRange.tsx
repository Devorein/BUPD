import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { ParseableDate } from '@mui/lab/internal/pickers/constants/prop-types';
import { BasePickerProps } from '@mui/lab/internal/pickers/typings/BasePicker';
import { TextField, Typography } from '@mui/material';
import { FormElementProps } from '../types';

export interface DateRangeProps<State> extends FormElementProps<State> { }

function DatePicker(props: { value: string, onChange: BasePickerProps<ParseableDate<string>, string | null>["onChange"] }) {
  return <DateTimePicker
    inputFormat="yyyy-MM-dd hh:mm:ss"
    value={props.value}
    onChange={props.onChange}
    renderInput={(params) => {
      if (params.inputProps) {
        params.inputProps.onChange = () => null;
        params.inputProps.value = params.inputProps ? new Date(params.inputProps.value as string).toString().split(" ").slice(0, 5).join(" ") : ""
      }
      return <TextField disabled {...params} />
    }}
  />
}

export function DateRange<State>(props: DateRangeProps<State>) {
  const { label, setState, state, stateKey } = props;
  const ranges = (state[stateKey] as unknown as [string, string]);

  return <div className="flex flex-col gap-3">
    <Typography variant="h5">{label}</Typography>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker value={ranges[0]} onChange={(value) => {
        setState({
          ...state,
          [stateKey]: [new Date(value!).toISOString().slice(0, 19).replace('T', ' '), ranges[1]]
        })
      }} />

      <DatePicker value={ranges[1]} onChange={(value) => {
        setState({
          ...state,
          [stateKey]: [ranges[0], new Date(value!).toISOString().slice(0, 19).replace('T', ' ')]
        })
      }} />
    </LocalizationProvider >
  </div>
}