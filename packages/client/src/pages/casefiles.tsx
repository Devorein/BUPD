import { GetCasefilesPayload, ICasefile, ICasefilePopulated, ICasefileSort, UpdateCasefilePayload } from "@bupd/types";
import { CasefilePayload } from "@bupd/validation";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { blue, green, grey, red } from '@mui/material/colors';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCreateAccessMutation } from "../api/mutations/useCreateAccessMutation";
import { useDeleteCasefileMutation, useDeleteCasefileMutationCache } from "../api/mutations/useDeleteCasefileMutation";
import { useUpdateCasefileMutation, useUpdateCasefileMutationCache } from "../api/mutations/useUpdateCasefileMutation";
import { useGetCasefilesQuery } from "../api/queries/useGetCasefilesQuery";
import { CasefileForm } from "../components/CasefileForm";
import { DeleteModal } from "../components/DeleteModal";
import { DetailsList } from "../components/DetailsList";
import { TransitionedModal } from "../components/Modal";
import { MutateIcons } from "../components/MutateIcons";
import { Paginate } from "../components/Paginate";
import { Tags } from "../components/Tags";
import { casefileSortLabelRecord } from "../constants";
import { useIsAuthenticated } from "../hooks/useIsAuthenticated";
import { useModal } from "../hooks/useModal";

dayjs.extend(relativeTime);

const createInitialGetCasefilesQuery = (): GetCasefilesPayload => ({
  limit: 10,
  next: null,
  sort: ['priority', -1],
  filter: {
    priority: [],
    status: [],
    time: ["2000-01-01 00:00:00", new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')]
  },
});

export default function Casefiles() {
  const currentUser = useIsAuthenticated();
  const createAccessMutation = useCreateAccessMutation();

  const { openModal: openUpdateModal, selectedData: selectedUpdateData, isModalOpen: isUpdateModalOpen, closeModal: closeUpdateModal
  } = useModal<ICasefilePopulated>();

  const deleteCasefileMutation = useDeleteCasefileMutation();
  const deleteCasefileMutationCache = useDeleteCasefileMutationCache();
  const updateCasefileMutation = useUpdateCasefileMutation();
  const updateCasefileMutationCache = useUpdateCasefileMutationCache();

  return <div className="flex gap-5 justify-center h-full w-full">
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
          <Paginate<GetCasefilesPayload, ICasefileSort, ICasefilePopulated>
            searchBarPlaceholder="Search by case no. Eg:- 1 2 10"
            filterGroups={[
              {
                type: "checkbox_group",
                props: {
                  items: [
                    [0, 'Low'],
                    [1, 'Medium'],
                    [2, 'High'],
                  ],
                  label: 'Priority',
                  stateKey: 'priority',
                }
              },
              {
                type: "checkbox_group",
                props: {
                  items: ['solved', 'open', 'closed'],
                  label: 'Status',
                  stateKey: 'status',
                }
              },
              {
                type: "date_range",
                props: {
                  label: "Time",
                  stateKey: "time"
                }
              },
            ]}
            dataListComponentFn={(casefiles) => {

              return <div className="grid grid-cols-3 gap-5 pr-5">
                {casefiles.map((casefile) => {
                  let permissionIcons: null | JSX.Element = null;
                  let mutateIcons: null | JSX.Element = null;
                  if (currentUser.type === "admin") {
                    mutateIcons = <MutateIcons onDeleteIconClick={() => {
                      openModal(casefile)
                    }} onUpdateIconClick={() => { openUpdateModal(casefile) }} />
                  } else {
                    mutateIcons = <MutateIcons showDeleteIcon={casefile.permissions?.delete === 1} showUpdateIcon={casefile.permissions?.update === 1} onDeleteIconClick={() => {
                      openModal(casefile)
                    }} onUpdateIconClick={() => { openUpdateModal(casefile) }} />
                  }

                  if (currentUser.type === "police") {
                    permissionIcons = <div className="flex gap-1">
                      {casefile.permissions?.read ? <VisibilityOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <VisibilityOutlinedIcon onClick={() => {
                        createAccessMutation.mutate({
                          case_no: casefile.case_no,
                          criminal_id: null,
                          permission: "read"
                        })
                      }} className="cursor-pointer" style={{ fill: green[500] }} fontSize="small" />}
                      {casefile.permissions?.update ? <EditOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <EditOutlinedIcon onClick={() => {
                        createAccessMutation.mutate({
                          case_no: casefile.case_no,
                          criminal_id: null,
                          permission: "update"
                        })
                      }} className="cursor-pointer" style={{ fill: blue[500] }} fontSize="small" />}
                      {casefile.permissions?.delete ? <DeleteOutlinedIcon style={{ fill: grey[500] }} fontSize="small" /> : <DeleteOutlinedIcon onClick={() => {
                        createAccessMutation.mutate({
                          case_no: casefile.case_no,
                          criminal_id: null,
                          permission: "delete"
                        })
                      }} className="cursor-pointer" style={{ fill: red[500] }} fontSize="small" />}
                    </div>
                  }

                  let priority = 'Low';
                  let backgroundColor = '#20da48d6';
                  if (casefile.priority === 2) {
                    backgroundColor = '#da2020d4';
                    priority = 'High';
                  } else if (casefile.priority === 1) {
                    backgroundColor = '#ebd82add';
                    priority = 'Medium';
                  }
                  return (
                    <div
                      className="border-2 shadow-md rounded-md p-5 flex flex-col gap-3"
                      key={casefile.case_no}
                    >
                      <div className="justify-between flex">
                        {permissionIcons}
                        {mutateIcons}
                      </div>
                      <div className="justify-center flex font-bold text-2xl">
                        Case {casefile.case_no}
                      </div>
                      {casefile.categories && casefile.categories.length !== 0 && <div className="flex flex-col gap-2">
                        <div className="text-center font-semibold text-lg">Categories</div>
                        <Tags tags={casefile.categories} />
                      </div>}
                      {casefile.weapons && casefile.weapons.length !== 0 && <div className="flex flex-col gap-2 mb-2">
                        <div className="text-center font-semibold text-lg">Weapons</div>
                        <Tags tags={casefile.weapons} />
                      </div>}
                      <DetailsList
                        items={[
                          ['Location', casefile.location],
                          ['Casefile NID', casefile.police_nid],
                          ['Time', dayjs().to(dayjs(casefile.time))],
                          [
                            'Status',
                            casefile.status
                          ],
                          [
                            'Priority',
                            <span
                              className="px-2 py-1 font-semibold text-sm rounded-sm"
                              key="priority"
                              style={{
                                backgroundColor,
                                color: 'white',
                              }}
                            >
                              {priority}
                            </span>,
                          ],
                        ]}
                      />
                    </div>
                  );
                })}
              </div>
            }}
            clientQueryFn={createInitialGetCasefilesQuery}
            dataFetcher={useGetCasefilesQuery}
            label="Casefiles"
            sortLabelRecord={casefileSortLabelRecord}
          />
        </>
      )}
    </DeleteModal>
  </div>
}