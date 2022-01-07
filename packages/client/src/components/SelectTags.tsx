import { useTheme } from '@mui/material';

export function SelectTags<Value extends string | string[] | number | number[]>(props: {
	values: Value;
}) {
	const theme = useTheme();
	if (Array.isArray(props.values)) {
		return (
			<div className="flex gap-2 flex-wrap">
				{props.values.map((value) => (
					<span
						key={value}
						className={`px-2 py-1 rounded-sm text-white font-normal`}
						style={{ background: theme.palette.primary.main }}
					>
						{value}
					</span>
				))}
			</div>
		);
	}
	return (
		<span
			className={`px-2 py-1 rounded-sm text-white font-normal`}
			style={{ background: theme.palette.primary.main }}
		>
			{props.values}
		</span>
	);
}
