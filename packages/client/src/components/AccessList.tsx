import { IAccess } from "@bupd/types";
import { Checkbox } from "@mui/material";
import { useUpdateAccessMutation } from "../api/mutations/useUpdateAccessMutation";

interface AccessListProps {
  accesses: IAccess[]
}

function AccessListItem(props: { access: IAccess }) {
  const { access } = props;
  const updateAccessMutation = useUpdateAccessMutation(access.access_id);
  return <div className="items-center flex gap-3 border-2 shadow-md px-5 py-2 rounded-sm justify-between" style={{ borderColor: '#dad8d85e' }}>
    <div className="text-lg font-semibold hover:underline cursor-pointer mr-5">{access.police_nid}</div>
    <div className="mr-5">Requesting <span className="uppercase font-bold text-sm">{access.permission}</span> access</div>
    <div>to <span className="uppercase font-bold hover:underline cursor-pointer text-sm">{access.type} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
    <Checkbox color="secondary" checked={Boolean(access.approved)} onChange={() => {
      updateAccessMutation.mutate({
        approved: access.approved === 0 ? 1 : 0
      })
    }} />
  </div>
}
export function AccessList(props: AccessListProps) {


  const { accesses } = props;
  return <div className="flex gap-5 flex-col">{
    accesses.map(access => <AccessListItem access={access} key={access.access_id} />)
  }</div>
}