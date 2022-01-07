import { POLICE_RANKS } from '@bupd/constants';
import {
	GetPolicesPayload,
	IPolice,
	IPolicePopulated,
	IPoliceSort,
	UpdatePolicePayload,
} from '@bupd/types';
import { PoliceRequest } from '@bupd/validation';
import {
	useDeletePoliceMutation,
	useDeletePoliceMutationCache,
} from '../api/mutations/useDeletePoliceMutation';
import {
	useUpdatePoliceMutation,
	useUpdatePoliceMutationCache,
} from '../api/mutations/useUpdatePoliceMutation';
import { useGetPolicesQuery } from '../api/queries/useGetPolicesQuery';
import { DeleteModal } from '../components/DeleteModal';
import { TransitionedModal } from '../components/Modal';
import { MutateIcons } from '../components/MutateIcons';
import { Paginate } from '../components/Paginate';
import { PoliceCard } from '../components/PoliceCard';
import { PoliceForm } from '../components/PoliceForm';
import { SelectTags } from '../components/SelectTags';
import { policeSortLabelRecord } from '../constants';
import { useIsAuthenticated } from '../hooks';
import { useModal } from '../hooks/useModal';

const updatePolicePayloadValidationSchema = PoliceRequest.update('client');

const createInitialGetPolicesQuery = (): GetPolicesPayload => ({
	limit: 10,
	next: null,
	sort: ['name', -1],
	filter: {
		designation: [],
		rank: [],
		search: [],
	},
});

export default function Polices() {
	const currentUser = useIsAuthenticated();

	const {
		openModal: openUpdateModal,
		selectedData: selectedUpdateData,
		isModalOpen: isUpdateModalOpen,
		closeModal: closeUpdateModal,
	} = useModal<IPolice>();

	const deletePoliceMutation = useDeletePoliceMutation();
	const deletePoliceMutationCache = useDeletePoliceMutationCache();

	const updatePoliceMutation = useUpdatePoliceMutation();
	const updatePoliceMutationCache = useUpdatePoliceMutationCache();

	return (
		<div className="flex justify-center w-full h-full">
			<DeleteModal<IPolice>
				isMutationLoading={deletePoliceMutation.isLoading}
				onDelete={(selectedData, closeModal) => {
					deletePoliceMutation.mutate(
						{
							endpoint: `police/${selectedData.nid}`,
						},
						deletePoliceMutationCache(selectedData.nid, () => {
							closeModal();
						})
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
							<PoliceForm<UpdatePolicePayload>
								showNid={false}
								showPassword={false}
								header="Update police"
								submitButtonText="Update"
								initialValues={selectedUpdateData!}
								isMutationLoading={updatePoliceMutation.isLoading}
								onSubmit={(values) => {
									if (selectedUpdateData) {
										updatePoliceMutation.mutate(
											{
												address: values.address,
												designation: values.designation,
												email: values.email,
												name: values.name,
												phone: values.phone,
												rank: values.rank,
												endpoint: `police/${selectedUpdateData.nid}`,
											},
											updatePoliceMutationCache(selectedUpdateData.nid, () => closeUpdateModal())
										);
									}
								}}
								validationSchema={updatePolicePayloadValidationSchema}
							/>
						</TransitionedModal>
						<Paginate<GetPolicesPayload, IPoliceSort, IPolicePopulated>
							searchBarPlaceholder="Search by nid. Eg:- 10000 12340"
							filterGroups={[
								{
									type: 'select',
									props: {
										items: POLICE_RANKS,
										label: 'Rank',
										stateKey: 'rank',
										multiple: true,
										renderValue: (renderValues) => <SelectTags values={renderValues} />,
									},
								},
							]}
							clientQueryFn={createInitialGetPolicesQuery}
							dataListComponentFn={(polices) => (
								<div className="grid grid-cols-3 gap-5 pr-5">
									{polices.map((police) => (
										<div
											className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3"
											key={police.nid}
										>
											{currentUser?.type === 'admin' && (
												<MutateIcons
													onDeleteIconClick={() => {
														openModal(police);
													}}
													onUpdateIconClick={() => {
														openUpdateModal(police);
													}}
												/>
											)}
											<PoliceCard police={police} />
										</div>
									))}
								</div>
							)}
							label="Polices"
							sortLabelRecord={policeSortLabelRecord}
							dataFetcher={useGetPolicesQuery}
						/>
					</>
				)}
			</DeleteModal>
		</div>
	);
}
