import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { blue, green, red } from '@mui/material/colors';
import { MouseEventHandler } from 'react';
import { svgIconSx } from '../constants';

interface MutateIconsProps {
	onUpdateIconClick: MouseEventHandler<SVGSVGElement>;
	onDeleteIconClick: MouseEventHandler<SVGSVGElement>;
	showUpdateIcon?: boolean;
	showViewIcon?: boolean;
	showDeleteIcon?: boolean;
	onViewIconClick?: () => void;
}

export function MutateIcons(props: MutateIconsProps) {
	const {
		onViewIconClick,
		showViewIcon = false,
		showDeleteIcon = true,
		showUpdateIcon = true,
		onDeleteIconClick,
		onUpdateIconClick,
	} = props;

	if (!showDeleteIcon && !showUpdateIcon && !showViewIcon) {
		return null;
	}

	return (
		<div className="flex gap-1 items-center">
			{showViewIcon && (
				<VisibilityIcon
					sx={svgIconSx}
					fontSize="small"
					className="cursor-pointer"
					style={{
						fill: green[500],
					}}
					onClick={onViewIconClick}
				/>
			)}
			{showDeleteIcon && (
				<DeleteIcon
					sx={svgIconSx}
					fontSize="small"
					className="cursor-pointer"
					style={{
						fill: red[500],
					}}
					onClick={onDeleteIconClick}
				/>
			)}
			{showUpdateIcon && (
				<EditIcon
					sx={svgIconSx}
					fontSize="small"
					className="cursor-pointer"
					style={{
						fill: blue[500],
					}}
					onClick={onUpdateIconClick}
				/>
			)}
		</div>
	);
}
