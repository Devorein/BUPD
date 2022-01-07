import { GetVictimsPayload, IVictim, IVictimPopulated, IVictimSort } from '@bupd/types';
import {
	useDeleteVictimMutation,
	useDeleteVictimMutationCache,
} from '../api/mutations/useDeleteVictimMutation';
import {
	useUpdateVictimMutation,
	useUpdateVictimMutationCache,
} from '../api/mutations/useUpdateVictimMutation';
import { useGetVictimsQuery } from '../api/queries/useGetVictimsQuery';
import { DeleteModal } from '../components/DeleteModal';
import { TransitionedModal } from '../components/Modal';
import { MutateIcons } from '../components/MutateIcons';
import { Paginate } from '../components/Paginate';
import { VictimCard } from '../components/VictimCard';
import { VictimForm } from '../components/VictimForm';
import { victimsSortLabelRecord } from '../constants';
import { useIsAuthenticated } from '../hooks';
import { useModal } from '../hooks/useModal';

const createInitialGetVictimsQuery = (): GetVictimsPayload => ({
	limit: 10,
	next: null,
	sort: ['name', -1],
	filter: {
		age: [10, 120],
		search: [],
	},
});

export default function Criminals() {
	useIsAuthenticated();
	const {
		openModal: openUpdateModal,
		selectedData: selectedUpdateData,
		isModalOpen: isUpdateModalOpen,
		closeModal: closeUpdateModal,
	} = useModal<IVictim>();

	const deleteVictimMutation = useDeleteVictimMutation();
	const deleteVictimMutationCache = useDeleteVictimMutationCache();

	const updateVictimMutation = useUpdateVictimMutation();
	const updateVictimMutationCache = useUpdateVictimMutationCache();

	return (
		<div className="flex justify-center w-full h-full">
			<DeleteModal<IVictim>
				isMutationLoading={deleteVictimMutation.isLoading}
				onDelete={(selectedData, closeModal) => {
					deleteVictimMutation.mutate(
						{
							case_no: selectedData.case_no,
							name: selectedData.name,
						},
						deleteVictimMutationCache(
							(victim) =>
								victim.case_no === selectedData.case_no && victim.name === selectedData.name,
							() => {
								closeModal();
							}
						)
					);
				}}
			>
				{({ openModal }) => (
					<>
						<TransitionedModal
							sx={{
								height: 'calc(100% - 150px)',
							}}
							isModalOpen={isUpdateModalOpen}
							onClose={closeUpdateModal}
						>
							<VictimForm
								initialValues={
									selectedUpdateData
										? { ...selectedUpdateData, name: selectedUpdateData.name }
										: ({} as any)
								}
								isMutationLoading={updateVictimMutation.isLoading}
								onSubmit={(values) => {
									if (selectedUpdateData) {
										updateVictimMutation.mutate(
											{
												address: values.address,
												age: values.age,
												case_no: values.case_no,
												description: values.description,
												name: values.name,
												phone_no: values.phone_no,
												old_name: selectedUpdateData.name,
											},
											updateVictimMutationCache(
												(victim) =>
													victim.case_no === selectedUpdateData.case_no &&
													victim.name === selectedUpdateData.name,
												() => {
													closeUpdateModal();
												}
											)
										);
									}
								}}
							/>
						</TransitionedModal>
						<Paginate<GetVictimsPayload, IVictimSort, IVictimPopulated>
							searchBarPlaceholder="Search by case no. Eg:- 1 2 10"
							filterGroups={[
								{
									type: 'number_range',
									props: {
										label: 'Age',
										max: 120,
										min: 10,
										stateKey: 'age',
										step: 5,
									},
								},
							]}
							clientQueryFn={createInitialGetVictimsQuery}
							dataListComponentFn={(victims) => (
								<div className="grid grid-cols-3 gap-5 pr-5">
									{victims.map((victim) => (
										<div
											className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3"
											key={`${victim.name}.${victim.case_no}`}
										>
											<MutateIcons
												showDeleteIcon={victim.permissions?.delete === 1}
												showUpdateIcon={victim.permissions?.update === 1}
												onDeleteIconClick={() => {
													openModal(victim);
												}}
												onUpdateIconClick={() => {
													openUpdateModal(victim);
												}}
											/>
											<VictimCard victim={victim} />
										</div>
									))}
								</div>
							)}
							label="Victims"
							sortLabelRecord={victimsSortLabelRecord}
							dataFetcher={useGetVictimsQuery}
						/>
					</>
				)}
			</DeleteModal>
		</div>
	);
}
