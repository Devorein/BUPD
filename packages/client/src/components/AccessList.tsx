import { IAccess } from "@bupd/types";
import { Checkbox } from "@mui/material";

interface AccessListProps {
  accesses: IAccess[]
}

export function AccessList(props: AccessListProps) {
  const { accesses } = props;
  return <div className="flex gap-5 flex-col">{
    accesses.map(access => <div className="flex gap-3 shadow-md px-5 py-2 justify-between" key={access.access_id}>
      <div className="text-lg font-semibold hover:underline cursor-pointer mr-5">{access.police_nid}</div>
      <div className="mr-5">Requesting <span className="uppercase font-bold text-sm">{access.permission}</span> access</div>
      <div>to <span className="uppercase font-bold hover:underline cursor-pointer text-sm">{access.type} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
      <Checkbox color="secondary" checked={Boolean(access.approved)} onChange={() => {
        console.log(123);
      }} />
    </div>)
  }</div>
}