import { Box, SxProps, Theme } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Modal, { ModalUnstyledTypeMap } from '@mui/material/Modal';
import * as React from 'react';

interface TransitionedModalProps {
	children: JSX.Element | null;
	isModalOpen: boolean;
	onClose: ModalUnstyledTypeMap['props']['onClose'];
	sx?: SxProps<Theme>;
}

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 2,
	maxHeight: '75%',
	overflow: 'hidden',
};

export function TransitionedModal(props: TransitionedModalProps) {
	const { isModalOpen, children, onClose, sx } = props;

	return (
		<div className="absolute">
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={isModalOpen}
				closeAfterTransition
				onClose={onClose}
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
					transitionDuration: 500,
				}}
			>
				<Fade in={isModalOpen}>
					<Box sx={{ ...style, ...(sx ?? {}) }}>{children}</Box>
				</Fade>
			</Modal>
		</div>
	);
}
