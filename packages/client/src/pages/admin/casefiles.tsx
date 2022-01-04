import { GetCasefilesPayload, ICasefile, ICasefilePopulated, ICasefileSort } from '@bupd/types';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { blue, green, grey, red } from '@mui/material/colors';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext } from 'react';
import { useCreateAccessMutation } from '../../api/mutations/useCreateAccessMutation';
import {
  useDeleteCasefileMutation,
  useDeleteCasefileMutationCache
} from '../../api/mutations/useDeleteCasefileMutation';
import { useGetCasefilesQuery } from '../../api/queries/useGetCasefilesQuery';
import { DeleteModal } from '../../components/DeleteModal';
import { DetailsList } from '../../components/DetailsList';
import { Paginate } from '../../components/Paginate';
import { Tags } from '../../components/Tags';
import { casefileSortLabelRecord, svgIconSx } from '../../constants';
import { RootContext } from '../../contexts';
import { useIsAuthenticated, useIsAuthorized } from '../../hooks';

dayjs.extend(relativeTime);

const createInitialGetCasefilesQuery = (): GetCasefilesPayload => ({
  limit: 10,
  next: null,
  sort: ['priority', -1],
  filter: {
    priority: [],
    status: [],
  },
});

export default function Casefiles() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);
  const deleteCasefileMutation = useDeleteCasefileMutation();
  const deleteCasefileMutationCache = useDeleteCasefileMutationCache();
  const { currentUser } = useContext(RootContext);

  const createAccessMutation = useCreateAccessMutation();

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
          <Paginate<GetCasefilesPayload, ICasefileSort, ICasefilePopulated>
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
            ]}
            dataListComponentFn={(casefiles) => (
              <div className="grid grid-cols-3 gap-5 pr-5">
                {casefiles.map((casefile) => {
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
                      className="border-2 shadow-md rounded-md p-5 flex flex-col gap-3 relative"
                      key={casefile.case_no}
                    >
                      {currentUser?.type === "admin" ? <div>
                        <DeleteIcon
                          sx={svgIconSx}
                          className="cursor-pointer absolute"
                          style={{
                            fill: red[500],
                          }}
                          onClick={() => {
                            openModal(casefile)
                          }}
                        />
                      </div> : <div className="flex gap-1 absolute items-center px-2 py-1 rounded-sm" style={{
                        backgroundColor: grey[100],
                      }}>
                        <VisibilityOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: casefile.case_no,
                            criminal_id: null,
                            permission: "read"
                          })
                        }} className="cursor-pointer" style={{ fill: green[500] }} fontSize="small" />
                        <EditOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: casefile.case_no,
                            criminal_id: null,
                            permission: "update"
                          })
                        }} className="cursor-pointer" style={{ fill: blue[500] }} fontSize="small" />
                        <DeleteOutlinedIcon onClick={() => {
                          createAccessMutation.mutate({
                            case_no: casefile.case_no,
                            criminal_id: null,
                            permission: "delete"
                          })
                        }} className="cursor-pointer" style={{ fill: red[500] }} fontSize="small" />
                      </div>}
                      <div className="justify-center flex font-bold text-2xl">
                        Case {casefile.case_no}
                      </div>
                      {casefile.categories && casefile.categories.length !== 0 && <div className="flex flex-col gap-2">
                        <div className="text-center font-semibold text-lg">Categories</div>
                        <Tags tags={casefile.categories.map(({ category }) => category)} />
                      </div>}
                      {casefile.weapons && casefile.weapons.length !== 0 && <div className="flex flex-col gap-2 mb-2">
                        <div className="text-center font-semibold text-lg">Weapons</div>
                        <Tags tags={casefile.weapons.map(({ weapon }) => weapon)} />
                      </div>}
                      <DetailsList
                        items={[
                          ['Location', casefile.location],
                          ['Police NID', casefile.police_nid],
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
            )}
            clientQueryFn={createInitialGetCasefilesQuery}
            dataFetcher={useGetCasefilesQuery}
            label="Casefiles"
            sortLabelRecord={casefileSortLabelRecord}
          />
        )}
      </DeleteModal>
    </div>
  );
}
