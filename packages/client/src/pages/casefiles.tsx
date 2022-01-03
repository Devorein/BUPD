import { GetCasefilesPayload, ICasefile, ICasefileSort } from "@bupd/types";
import { useGetCasefilesQuery } from "../api/queries/useGetCasefilesQuery";
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
      items: ['high', 'medium', 'low'],
      label: "Priority",
      stateKey: "priority"
    }, {
      items: ['solved', 'open', 'closed'],
      label: "Status",
      stateKey: "status"
    }]} dataListComponentFn={(items) => <div>Casefiles</div>} clientQueryFn={createInitialGetCasefilesQuery} dataFetcher={useGetCasefilesQuery} label="Casefiles" sortLabelRecord={casefileSortLabelRecord} />
  </div>
}