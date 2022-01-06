import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { blue, green, red } from '@mui/material/colors';
import { useCreateAccessMutation } from '../../api/mutations/useCreateAccessMutation';
import { CasefileList } from '../../components/CasefileList';
import { useIsAuthenticated, useIsAuthorized } from '../../hooks';

export default function Casefiles() {

  useIsAuthenticated();
  useIsAuthorized(["police"]);

  const createAccessMutation = useCreateAccessMutation();
  return <CasefileList mutateIcons={(casefile) => {
    return <div className="flex gap-1 absolute items-center px-2 py-1 rounded-sm">
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
    </div>
  }} />
} 