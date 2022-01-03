import { GetAccessesPayload, IAccessPopulated, IAccessSort } from "@bupd/types";
import { useState } from "react";
import { useGetAccessesQuery } from "../api";
import { AccessDetails, AccessDetailsProps } from "../components/AccessDetails";
import { AccessList } from "../components/AccessList";
import { Paginate } from "../components/Paginate";
import { accessSortLabelRecord } from "../constants";

const createInitialGetAccessesQuery = (): GetAccessesPayload => ({
  limit: 10,
  next: null,
  sort: ["approved", -1],
  filter: {
    approved: [],
    permission: [],
    type: [],
  }
})

export default function Accesses() {
  const [currentDetail, setAccessDetail] = useState<AccessDetailsProps["data"]>(null)
  return <div className="flex gap-5 h-full">
    <Paginate<GetAccessesPayload, IAccessSort, IAccessPopulated> checkboxGroups={[{
      items: [
        ['2', <div key="unapproved">Unapproved</div>],
        ['1', <div key="approved">Approved</div>],
        ['0', <div key="disapproved">Disapproved</div>]
      ],
      label: "Approval",
      stateKey: "approved"
    }, {
      items: [
        ['case', <div key="case">Case</div>],
        ['criminal', <div key="criminal">Criminal</div>]
      ],
      label: "Type",
      stateKey: "type"
    }, {
      items: [
        ['read', <div key="read">View</div>],
        ['update', <div key="update">Update</div>],
        ['delete', <div key="delete">Delete</div>]
      ],
      label: "Permission",
      stateKey: "permission"
    }]} dataListComponentFn={(items) => <AccessList accesses={items} setAccessDetail={setAccessDetail} />} clientQueryFn={createInitialGetAccessesQuery} dataFetcher={useGetAccessesQuery} label="Access Requests" sortLabelRecord={accessSortLabelRecord} />
    <div className="my-2">
      <AccessDetails data={currentDetail} />
    </div>
  </div>
}