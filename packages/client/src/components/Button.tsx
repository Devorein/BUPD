import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { ReactNode } from 'react';

interface ButtonProps extends MuiButtonProps {
	content: ReactNode;
	classNames?: {
		button?: string;
		typography?: string;
	};
}

export function Button(props: ButtonProps) {
	const { sx, content, classNames = {}, ...extraProps } = props;
	return (
		<MuiButton
			sx={sx}
			color="primary"
			variant="contained"
			className={`Button ${classNames.button ?? ''}`}
			{...extraProps}
		>
			<div className={`Button-text ${classNames.typography ?? ''}`}>{content}</div>
		</MuiButton>
	);
}
