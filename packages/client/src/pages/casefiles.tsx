import { GetCasefilesPayload, ICasefile, ICasefileSort } from "@bupd/types";
import { grey } from "@mui/material/colors";
import { useGetCasefilesQuery } from "../api/queries/useGetCasefilesQuery";
import { DetailsList } from "../components/DetailsList";
import { Paginate } from "../components/Paginate";
import { casefileSortLabelRecord } from "../constants";

const createInitialGetCasefilesQuery = (): GetCasefilesPayload => ({
  limit: 10,
  next: null,
  sort: ["priority", -1],
  filter: {
    priority: [],
    status: [],
  }
})

export default function Casefiles() {
  return <div className="flex gap-5 h-full">
    <Paginate<GetCasefilesPayload, ICasefileSort, ICasefile> checkboxGroups={[{
      items: [
        [0, 'Low'],
        [1, 'Medium'],
        [2, 'High'],
      ],
      label: "Priority",
      stateKey: "priority"
    }, {
      items: ['solved', 'open', 'closed'],
      label: "Status",
      stateKey: "status"
    }]} dataListComponentFn={(casefiles) => <div className="grid grid-cols-3 gap-5 pr-5">
      {casefiles.map(casefile => {
        let priority = "Low";
        let backgroundColor = "#20da48d6";
        if (casefile.priority === 2) {
          backgroundColor = "#da2020d4"
          priority = "High";
        } else if (casefile.priority === 1) {
          backgroundColor = "#ebd82add"
          priority = "Medium";
        }
        return <div className="border-2 shadow-md rounded-md p-5 flex flex-col gap-3" key={casefile.case_no}>
          <div className="justify-center flex font-bold text-2xl my-2">Case {casefile.case_no}</div>
          <DetailsList items={[
            ["Location", casefile.location],
            ["Police NID", casefile.police_nid],
            ["Time", casefile.time],
            ["Priority", <span className="px-2 py-1 font-semibold text-sm rounded-sm" key="priority" style={{
              backgroundColor,
              color: "white"
            }}>
              {priority}
            </span>],
            ["Status", <span className="border-2 px-2 py-1 font-semibold text-sm rounded-md" key="status" style={{
              backgroundColor: grey[100]
            }}>
              {casefile.status}
            </span>],
          ]} />
        </div>
      })}
    </div>} clientQueryFn={createInitialGetCasefilesQuery} dataFetcher={useGetCasefilesQuery} label="Casefiles" sortLabelRecord={casefileSortLabelRecord} />
  </div>
}