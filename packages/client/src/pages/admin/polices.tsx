import { IPolice, UpdatePolicePayload } from "@bupd/types";
import { PoliceRequest } from "@bupd/validation";
import { useDeletePoliceMutation, useDeletePoliceMutationCache } from "../../api/mutations/useDeletePoliceMutation";
import { useUpdatePoliceMutation, useUpdatePoliceMutationCache } from "../../api/mutations/useUpdatePoliceMutation";
import { DeleteModal } from "../../components/DeleteModal";
import { TransitionedModal } from "../../components/Modal";
import { MutateIcons } from "../../components/MutateIcons";
import { PoliceForm } from "../../components/PoliceForm";
import { PoliceList } from "../../components/PoliceList";
import { useIsAuthenticated, useIsAuthorized } from "../../hooks";
import { useModal } from "../../hooks/useModal";

const updatePolicePayloadValidationSchema = PoliceRequest.update("client");

export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);
  const { openModal: openUpdateModal, selectedData: selectedUpdateData, isModalOpen: isUpdateModalOpen, closeModal: closeUpdateModal
  } = useModal<IPolice>();

  const deletePoliceMutation = useDeletePoliceMutation();
  const deletePoliceMutationCache = useDeletePoliceMutationCache();

  const updatePoliceMutation = useUpdatePoliceMutation();
  const updatePoliceMutationCache = useUpdatePoliceMutationCache();

  return <div className="flex justify-center w-full h-full">
    <DeleteModal<IPolice> isMutationLoading={deletePoliceMutation.isLoading} onDelete={(selectedData, closeModal) => {
      deletePoliceMutation.mutate({
        endpoint: `police/${selectedData.nid}`
      }, deletePoliceMutationCache(selectedData.nid, () => {
        closeModal()
      }))
    }}>
      {({
        openModal
      }) => <>
          <TransitionedModal sx={{
            height: 'calc(100% - 150px)'
          }} isModalOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
            <PoliceForm<UpdatePolicePayload> showNid={false} showPassword={false} header="Update police" submitButtonText="Update" initialValues={selectedUpdateData!} isMutationLoading={updatePoliceMutation.isLoading} onSubmit={(values) => {
              if (selectedUpdateData) {
                updatePoliceMutation.mutate({
                  address: values.address,
                  designation: values.designation,
                  email: values.email,
                  name: values.name,
                  phone: values.phone,
                  rank: values.rank,
                  endpoint: `police/${selectedUpdateData.nid}`
                }, updatePoliceMutationCache(selectedUpdateData.nid, () => closeUpdateModal()))
              }
            }} validationSchema={updatePolicePayloadValidationSchema} />
          </TransitionedModal>
          <PoliceList mutateIcons={(police) => <MutateIcons onDeleteIconClick={() => {
            openModal(police)
          }} onUpdateIconClick={() => {
            openUpdateModal(police)
          }} />} />
        </>}
    </DeleteModal>
  </div>
}