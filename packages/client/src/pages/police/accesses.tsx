import { GetPoliceAccessesPayload, IAccess, IAccessSort } from "@bupd/types";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkIcon from '@mui/icons-material/Work';
import { useGetPoliceAccessesQuery } from "../../api/queries/useGetPoliceAccessesQuery";
import { ApprovalIcons } from "../../components/ApprovalIcons";
import { Paginate } from "../../components/Paginate";
import { AccessesFilterGroup, accessSortLabelRecord, createInitialGetAccessesQuery, PermissionIconRecord } from "../../constants";

export default function Accesses() {
  return <div className="flex gap-5 h-full">
    <Paginate<GetPoliceAccessesPayload, IAccessSort, IAccess> filterGroups={AccessesFilterGroup()} dataListComponentFn={(accesses) => <div className="pr-5 grid grid-cols-2 gap-5">
      {accesses.map((access, accessIndex) => <div key={access.access_id} className="items-center flex gap-3 border-2 shadow-md p-5 rounded-sm justify-between" style={{ borderColor: '#dad8d85e' }}>
        <div className="flex gap-3 items-center">
          <div className="font-bold">{accessIndex + 1}.</div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">Requested {PermissionIconRecord[access.permission]} access</div>
          <div className="flex items-center gap-2">to <span className="flex items-center gap-1 uppercase font-bold hover:underline cursor-pointer text-sm">{access.type === "criminal" ? <AccountBoxIcon fontSize="small" /> : <WorkIcon fontSize="small" />} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
        </div>
        <ApprovalIcons hoverable={false} accessId={access.access_id} approved={access.approved} />
      </div>)}
    </div>} clientQueryFn={createInitialGetAccessesQuery} dataFetcher={useGetPoliceAccessesQuery} label="Access Requests" sortLabelRecord={accessSortLabelRecord} />
  </div>
}