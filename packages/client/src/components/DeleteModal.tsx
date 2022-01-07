import { ReactNode } from 'react';
import { UseModal, useModal } from '../hooks/useModal';
import { Button } from './Button';
import { TransitionedModal } from './Modal';

interface DeleteModalProps<Data> {
	onDelete: (selectedData: Data, closeModal: () => void) => void;
	isMutationLoading: boolean;
	children: (renderProps: UseModal<Data>) => ReactNode;
}

export function DeleteModal<Data>(props: DeleteModalProps<Data>) {
	const { onDelete, children, isMutationLoading } = props;
	const useModalValues = useModal<Data>();
	const { closeModal, selectedData, isModalOpen } = useModalValues;
	return (
		<>
			<TransitionedModal
				isModalOpen={isModalOpen}
				onClose={() => {
					closeModal();
				}}
			>
				<div className="p-5 flex flex-col gap-5">
					<div className="text-center text-2xl font-bold uppercase">
						Are you sure you want to delete?
					</div>
					<div className="text-center text-md font-medium">This action can&apos;t be reversed</div>
					<div className="flex justify-between mt-5">
						<Button
							content="Confirm"
							disabled={isMutationLoading || !selectedData}
							color="secondary"
							onClick={() => {
								if (selectedData) {
									onDelete(selectedData, closeModal);
								}
							}}
						/>
						<Button
							disabled={isMutationLoading || !selectedData}
							content="Cancel"
							onClick={() => closeModal()}
						/>
					</div>
				</div>
			</TransitionedModal>
			{children(useModalValues)}
		</>
	);
}
