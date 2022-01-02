import { IAccess, TAccessPermission } from "@bupd/types";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkIcon from '@mui/icons-material/Work';
import { Checkbox } from "@mui/material";
import { useUpdateAccessMutation, useUpdateAccessMutationCache } from "../api/mutations/useUpdateAccessMutation";

interface AccessListProps {
  accesses: IAccess[]
}

const PermissionIconRecord: Record<TAccessPermission, JSX.Element> = {
  delete: <DeleteIcon fontSize="small" />,
  update: <EditIcon fontSize="small" />,
  read: <VisibilityIcon fontSize="small" />,
  write: <EditIcon fontSize="small" />,
}

function AccessListItem(props: { access: IAccess }) {
  const { access } = props;
  const updateAccessMutation = useUpdateAccessMutation(access.access_id);
  const updateAccessMutationCache = useUpdateAccessMutationCache();

  return <div className="items-center flex gap-3 border-2 shadow-md px-5 py-2 rounded-sm justify-between" style={{ borderColor: '#dad8d85e' }}>
    <div className="text-lg font-semibold hover:underline cursor-pointer mr-5">{access.police_nid}</div>
    <div className="mr-5 flex items-center gap-2">Requesting {PermissionIconRecord[access.permission]}  access</div>
    <div className="flex items-center gap-2">to <span className="flex items-center gap-1 uppercase font-bold hover:underline cursor-pointer text-sm">{access.type === "criminal" ? <AccountBoxIcon fontSize="small" /> : <WorkIcon fontSize="small" />} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
    <Checkbox color="secondary" checked={Boolean(access.approved)} onChange={() => {
      updateAccessMutation.mutate({
        approved: access.approved === 0 ? 1 : 0
      }, updateAccessMutationCache(access.access_id))
    }} />
  </div>
}
export function AccessList(props: AccessListProps) {


  const { accesses } = props;
  return <div className="flex gap-5 flex-col">{
    accesses.map(access => <AccessListItem access={access} key={access.access_id} />)
  }</div>
}