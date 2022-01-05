import { GetCriminalsPayload, ICriminal, ICriminalPopulated, ICriminalSort, UpdateCriminalPayload } from '@bupd/types';
import { CriminalPayload } from '@bupd/validation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { blue, red } from '@mui/material/colors';
import {
  useDeleteCriminalMutation,
  useDeleteCriminalMutationCache
} from '../../api/mutations/useDeleteCriminalMutation';
import { useUpdateCriminalMutation, useUpdateCriminalMutationCache } from '../../api/mutations/useUpdateCriminalMutation';
import { useGetCriminalsQuery } from '../../api/queries/useGetCriminalsQuery';
import { CriminalForm } from '../../components/CriminalForm';
import { DeleteModal } from '../../components/DeleteModal';
import { DetailsList } from '../../components/DetailsList';
import { TransitionedModal } from '../../components/Modal';
import { Paginate } from '../../components/Paginate';
import { criminalSortLabelRecord, svgIconSx } from '../../constants';
import { useIsAuthenticated, useIsAuthorized } from '../../hooks';
import { useModal } from '../../hooks/useModal';

const createInitialGetCriminalsQuery = (): GetCriminalsPayload => ({
  limit: 10,
  next: null,
  sort: ['name', -1],
  filter: {},
});

export default function Criminals() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);
  const deleteCriminalMutation = useDeleteCriminalMutation();
  const deleteCriminalMutationCache = useDeleteCriminalMutationCache();

  const { openModal: openUpdateModal, selectedData: selectedUpdateData, isModalOpen: isUpdateModalOpen, closeModal: closeUpdateModal
  } = useModal<ICriminal>();

  const updateCriminalMutation = useUpdateCriminalMutation();
  const updateCriminalMutationCache = useUpdateCriminalMutationCache();

  return (
    <div className="flex justify-center w-full h-full">
      <DeleteModal<ICriminalPopulated>
        isMutationLoading={deleteCriminalMutation.isLoading}
        onDelete={(selectedData, closeModal) => {
          deleteCriminalMutation.mutate(
            {
              endpoint: `criminal/${selectedData.criminal_id}`,
            },
            deleteCriminalMutationCache(selectedData.criminal_id, () => {
              closeModal();
            })
          );
        }}
      >
        {({ openModal }) => (
          <>
            <TransitionedModal isModalOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
              <CriminalForm<UpdateCriminalPayload> initialValues={selectedUpdateData!} isMutationLoading={updateCriminalMutation.isLoading} onSubmit={(values) => {
                if (selectedUpdateData) {
                  updateCriminalMutation.mutate({
                    name: values.name,
                    photo: values.photo,
                    endpoint: `criminal/${selectedUpdateData.criminal_id}`
                  }, updateCriminalMutationCache(selectedUpdateData.criminal_id, () => closeUpdateModal()))
                }
              }} validationSchema={CriminalPayload.update} />
            </TransitionedModal>
            <Paginate<GetCriminalsPayload, ICriminalSort, ICriminalPopulated>
              filterGroups={[]}
              clientQueryFn={createInitialGetCriminalsQuery}
              dataListComponentFn={(criminals) => (
                <div className="grid grid-cols-5 gap-5 pr-5">
                  {criminals.map((criminal) => (
                    <div
                      className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3"
                      key={criminal.criminal_id}
                    >
                      <div className="flex gap-1 absolute items-center">
                        <DeleteIcon
                          sx={svgIconSx}
                          className="cursor-pointer"
                          style={{
                            fill: red[500],
                          }}
                          onClick={() => {
                            openModal(criminal);
                          }}
                        />
                        <EditIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
                          fill: blue[500]
                        }} onClick={() => {
                          openUpdateModal(criminal)
                        }} />
                      </div>
                      <div className="flex justify-center w-full mb-5">
                        <img
                          className="h-[50px] w-[50px] rounded-full shadow-md"
                          alt="profile"
                          src={
                            'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg'
                          }
                        />
                      </div>
                      <DetailsList
                        items={[
                          ['Name', criminal.name],
                          ['ID', criminal.criminal_id],
                          ['Total Cases', criminal.total_cases],
                        ]}
                      />
                    </div>
                  ))}
                </div>
              )}
              label="Criminals"
              sortLabelRecord={criminalSortLabelRecord}
              dataFetcher={useGetCriminalsQuery}
            />
          </>
        )}
      </DeleteModal>
    </div>
  );
}
