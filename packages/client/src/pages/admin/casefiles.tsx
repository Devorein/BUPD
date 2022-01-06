import { ICasefile, ICasefilePopulated, UpdateCasefilePayload } from '@bupd/types';
import { CasefilePayload } from '@bupd/validation';
import {
  useDeleteCasefileMutation,
  useDeleteCasefileMutationCache
} from '../../api/mutations/useDeleteCasefileMutation';
import { useUpdateCasefileMutation, useUpdateCasefileMutationCache } from '../../api/mutations/useUpdateCasefileMutation';
import { CasefileForm } from '../../components/CasefileForm';
import { CasefileList } from '../../components/CasefileList';
import { DeleteModal } from '../../components/DeleteModal';
import { TransitionedModal } from '../../components/Modal';
import { MutateIcons } from '../../components/MutateIcons';
import { useIsAuthenticated, useIsAuthorized } from '../../hooks';
import { useModal } from '../../hooks/useModal';

export default function Casefiles() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);
  const { openModal: openUpdateModal, selectedData: selectedUpdateData, isModalOpen: isUpdateModalOpen, closeModal: closeUpdateModal
  } = useModal<ICasefilePopulated>();

  const deleteCasefileMutation = useDeleteCasefileMutation();
  const deleteCasefileMutationCache = useDeleteCasefileMutationCache();
  const updateCasefileMutation = useUpdateCasefileMutation();
  const updateCasefileMutationCache = useUpdateCasefileMutationCache();

  return (
    <div className="flex gap-5 justify-center h-full w-full">
      <DeleteModal<ICasefile>
        isMutationLoading={deleteCasefileMutation.isLoading}
        onDelete={(selectedData, closeModal) => {
          deleteCasefileMutation.mutate(
            {
              endpoint: `casefile/${selectedData.case_no}`,
            },
            deleteCasefileMutationCache(selectedData.case_no, () => {
              closeModal();
            })
          );
        }}
      >
        {({ openModal }) => (
          <>
            <TransitionedModal sx={{
              height: 'calc(100% - 150px)'
            }} isModalOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
              <CasefileForm<UpdateCasefilePayload> showExtra={false} header={"Update case"} isMutationLoading={updateCasefileMutation.isLoading} submitButtonText="Update" initialValues={selectedUpdateData!} onSubmit={async (values) => {
                if (selectedUpdateData) {
                  updateCasefileMutation.mutate({
                    endpoint: `casefile/${selectedUpdateData.case_no}`,
                    location: values.location,
                    priority: values.priority,
                    status: values.status,
                    categories: values.categories,
                    weapons: values.weapons
                  }, updateCasefileMutationCache(selectedUpdateData.case_no, () => closeUpdateModal()))
                }
              }} validationSchema={CasefilePayload.update} />
            </TransitionedModal>
            <CasefileList mutateIcons={(casefile) => {
              return <MutateIcons onDeleteIconClick={() => {
                openModal(casefile)
              }} onUpdateIconClick={() => { openUpdateModal(casefile) }} />
            }} />
          </>
        )}
      </DeleteModal>
    </div>
  );
}