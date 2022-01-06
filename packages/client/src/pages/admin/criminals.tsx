import { GetCriminalsPayload, ICriminal, ICriminalPopulated, ICriminalSort, UpdateCriminalPayload } from '@bupd/types';
import { CriminalPayload } from '@bupd/validation';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { blue, green, grey, red } from '@mui/material/colors';
import { useCreateAccessMutation, useCreateAccessMutationCache } from '../../api/mutations/useCreateAccessMutation';
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
import { MutateIcons } from '../../components/MutateIcons';
import { Paginate } from '../../components/Paginate';
import { criminalSortLabelRecord } from '../../constants';
import { useIsAuthenticated, useIsAuthorized } from '../../hooks';
import { useModal } from '../../hooks/useModal';

const createInitialGetCriminalsQuery = (): GetCriminalsPayload => ({
  limit: 10,
  next: null,
  sort: ['name', -1],
  filter: {},
});

export default function Criminals() {
  const currentUser = useIsAuthenticated();
  useIsAuthorized(["admin"]);
  const deleteCriminalMutation = useDeleteCriminalMutation();
  const deleteCriminalMutationCache = useDeleteCriminalMutationCache();
  const createAccessMutation = useCreateAccessMutation();
  const createAccessMutationCache = useCreateAccessMutationCache();

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
              searchBarPlaceholder="Search by criminal id. Eg:- 1 2 10"
              filterGroups={[]}
              clientQueryFn={createInitialGetCriminalsQuery}
              dataListComponentFn={(criminals) => (
                <div className="grid grid-cols-5 gap-5 pr-5">
                  {criminals.map((criminal) => {
                    let permissionIcons: null | JSX.Element = null;
                    let mutateIcons: null | JSX.Element = null;
                    if (currentUser.type === "admin") {
                      mutateIcons = <MutateIcons onDeleteIconClick={() => {
                        openModal(criminal)
                      }} onUpdateIconClick={() => { openUpdateModal(criminal) }} />
                    } else {
                      mutateIcons = <MutateIcons showDeleteIcon={criminal.permissions?.delete === 1} showUpdateIcon={criminal.permissions?.update === 1} onDeleteIconClick={() => {
                        openModal(criminal)
                      }} onUpdateIconClick={() => { openUpdateModal(criminal) }} />
                    }

                    if (currentUser.type === "police") {
                      permissionIcons = <div className="flex gap-1">
                        {criminal.permissions?.read ? <VisibilityOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <VisibilityOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: null,
                            criminal_id: criminal.criminal_id,
                            permission: "read"
                          }, createAccessMutationCache(criminal.criminal_id, `Successfully sent read request for criminal ${criminal.criminal_id}`))
                        }} className="cursor-pointer" style={{ fill: green[500] }} fontSize="small" />}
                        {criminal.permissions?.update ? <EditOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <EditOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: null,
                            criminal_id: criminal.criminal_id,
                            permission: "update"
                          }, createAccessMutationCache(criminal.criminal_id, `Successfully sent update request for criminal ${criminal.criminal_id}`))
                        }} className="cursor-pointer" style={{ fill: blue[500] }} fontSize="small" />}
                        {criminal.permissions?.delete ? <DeleteOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <DeleteOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: null,
                            criminal_id: criminal.criminal_id,
                            permission: "delete"
                          }, createAccessMutationCache(criminal.criminal_id, `Successfully sent delete request for criminal ${criminal.criminal_id}`))
                        }} className="cursor-pointer" style={{ fill: red[500] }} fontSize="small" />}
                      </div>
                    }

                    return <div
                      className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3"
                      key={criminal.criminal_id}
                    >
                      <div className="justify-between flex">
                        {permissionIcons}
                        {mutateIcons}
                      </div>
                      <div className="flex justify-center w-full mb-5">
                        <img
                          className="h-[50px] w-[50px] rounded-full shadow-md"
                          alt="profile"
                          src={
                            criminal.photo ?? 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg'
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
                  })}
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
