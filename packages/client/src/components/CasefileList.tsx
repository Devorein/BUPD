import { GetCasefilesPayload, ICasefilePopulated, ICasefileSort } from "@bupd/types";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetCasefilesQuery } from "../api/queries/useGetCasefilesQuery";
import { casefileSortLabelRecord } from "../constants";
import { DetailsList } from "./DetailsList";
import { Paginate } from "./Paginate";
import { Tags } from "./Tags";

dayjs.extend(relativeTime);

interface CasefileListProps {
  mutateIcons: (casefile: ICasefilePopulated) => void
}

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

export function CasefileList(props: CasefileListProps) {
  const { mutateIcons } = props;
  return <Paginate<GetCasefilesPayload, ICasefileSort, ICasefilePopulated>
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
              {mutateIcons(casefile)}
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
    )}
    clientQueryFn={createInitialGetCasefilesQuery}
    dataFetcher={useGetCasefilesQuery}
    label="Casefiles"
    sortLabelRecord={casefileSortLabelRecord}
  />
}