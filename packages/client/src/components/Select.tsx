import {
	MenuItem,
	Select as MuiSelect,
	SelectProps as MuiSelectProps,
	Typography,
} from '@mui/material';
import { ReactNode } from 'react';

export interface SelectProps<Value> extends MuiSelectProps<Value> {
	items: (string | number)[];
	renderValue?: (value: Value) => ReactNode;
	className?: string;
	menuItemRender?: (item: string | number) => ReactNode;
	label?: ReactNode;
}

export function Select<Value>(props: SelectProps<Value>) {
	const {
		menuItemRender,
		renderValue,
		className = '',
		defaultValue,
		items,
		value,
		onChange,
		label,
		...restProps
	} = props;
	return (
		<>
			{label && (
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
			)}
			<MuiSelect<Value>
				{...restProps}
				value={value}
				defaultValue={defaultValue}
				className={`bold rounded-sm shadow-md ${className}`}
				renderValue={(valueToRender) => (renderValue ? renderValue(valueToRender) : valueToRender)}
				sx={{
					'& .MuiSvgIcon-root': {
						fill: `black`,
					},
				}}
				onChange={onChange}
			>
				{items.map((item) => (
					<MenuItem className="capitalize" key={item} value={item}>
						{menuItemRender ? menuItemRender(item) : item}
					</MenuItem>
				))}
			</MuiSelect>
		</>
	);
}
