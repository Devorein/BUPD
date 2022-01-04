import { GetCasefilesPayload, ICasefile, ICasefileSort } from '@bupd/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { grey, red } from '@mui/material/colors';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useDeleteCasefileMutation,
  useDeleteCasefileMutationCache
} from '../api/mutations/useDeleteCasefileMutation';
import { useGetCasefilesQuery } from '../api/queries/useGetCasefilesQuery';
import { DeleteModal } from '../components/DeleteModal';
import { DetailsList } from '../components/DetailsList';
import { Paginate } from '../components/Paginate';
import { casefileSortLabelRecord, svgIconSx } from '../constants';
import { useIsAuthenticated } from '../hooks';

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
  const deleteCasefileMutation = useDeleteCasefileMutation();
  const deleteCasefileMutationCache = useDeleteCasefileMutationCache();

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
          <Paginate<GetCasefilesPayload, ICasefileSort, ICasefile>
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
                      <div>
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
                      </div>
                      <div className="justify-center flex font-bold text-2xl my-2">
                        Case {casefile.case_no}
                      </div>
                      <DetailsList
                        items={[
                          ['Location', casefile.location],
                          ['Police NID', casefile.police_nid],
                          ['Time', dayjs().to(dayjs(casefile.time))],
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
                          [
                            'Status',
                            <span
                              className="border-2 px-2 py-1 font-semibold text-sm rounded-md"
                              key="status"
                              style={{
                                backgroundColor: grey[100],
                              }}
                            >
                              {casefile.status}
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
