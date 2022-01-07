import { InputBaseComponentProps, TextField, Typography } from '@mui/material';
import React from 'react';
import { FormElementProps } from '../types';

export interface NumberRangeProps<State> extends FormElementProps<State> {
	step: number;
	min: number;
	max: number;
}

interface NumberRangeItemProps {
	label: string;
	value: number;
	inputProps?: InputBaseComponentProps | undefined;
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

function NumberRangeItem(props: NumberRangeItemProps) {
	const { label, value, inputProps, onChange } = props;
	return (
		<div className="NumberRange-max flex flex-1 flex-col">
			<div className="my-1">
				<Typography className="NumberRange-max-label" variant="body2">
					{label}
				</Typography>
			</div>
			<TextField
				variant="outlined"
				className="flex-1"
				inputProps={inputProps}
				type="number"
				value={value ?? 0}
				onChange={onChange}
			/>
		</div>
	);
}

export function NumberRange<State>(props: NumberRangeProps<State>) {
	const { state, setState, stateKey, label, step, min, max } = props;
	const inputs = state[stateKey] as unknown as [number, number];

	return (
		<div className="NumberRange flex flex-col gap-2">
			<Typography
				sx={{
					fontSize: {
						xs: '1.25rem',
						sm: '1.5rem',
					},
				}}
				variant="h5"
			>
				{label}
			</Typography>
			<div className="flex flex-row gap-2">
				<NumberRangeItem
					label="Min"
					value={inputs[0]}
					inputProps={{ step, min, max: inputs[1] }}
					onChange={(e) => setState({ ...state, [stateKey]: [Number(e.target.value), inputs[1]] })}
				/>
				<NumberRangeItem
					label="Max"
					value={inputs[1]}
					inputProps={{ step, min: inputs[0], max }}
					onChange={(e) => setState({ ...state, [stateKey]: [inputs[0], Number(e.target.value)] })}
				/>
			</div>
		</div>
	);
}
