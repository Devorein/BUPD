import {
  GetAccessesPayload,
  IAccessSort,
  ICasefileSort,
  ICriminalSort,
  IPoliceSort,
  IVictimSort,
  TAccessPermission
} from '@bupd/types';
import { Theme } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SxProps } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';
import { FilterFormProps } from './components/FilterForm';

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000/v1';
export const JWT_LS_KEY = 'bupd.jwt.token';

export const svgIconSx: SxProps<Theme> = {
  '&': {
    transition: 'transform 150ms ease-in-out',
  },
  '&:hover': {
    transform: `scale(1.25)`,
    transition: 'transform 150ms ease-in-out',
  },
};

export const accessSortLabelRecord: Record<`${IAccessSort[0]}.${IAccessSort[1]}`, string> = {
  'approved.-1': 'Unapproved first',
  'approved.1': 'Disapproved first',
  'case_no.-1': 'Case first',
  'criminal_id.-1': 'Criminal first',
  'permission.-1': 'Permission desc',
  'permission.1': 'Permission asc',
} as any;

export const policeSortLabelRecord: Record<`${IPoliceSort[0]}.${IPoliceSort[1]}`, string> = {
  'designation.-1': 'Designation desc',
  'designation.1': 'Designation asc',
  'name.-1': 'Name desc',
  'name.1': 'Name asc',
  'rank.-1': 'Rank desc',
  'rank.1': 'Rank asc',
};

export const casefileSortLabelRecord: Record<`${ICasefileSort[0]}.${ICasefileSort[1]}`, string> = {
  'case_no.-1': 'Highest case no',
  'case_no.1': 'Lowest case no',
  'priority.-1': 'Highest priority',
  'priority.1': 'Lowest priority',
  'status.-1': 'Solved first',
  'status.1': 'Closed first',
  'time.-1': 'Newest',
  'time.1': 'Oldest',
};

export const criminalSortLabelRecord: Record<`${ICriminalSort[0]}.${ICriminalSort[1]}`, string> = {
  'criminal_id.-1': 'Highest criminal id',
  'criminal_id.1': 'Lowest criminal id',
  'name.-1': 'Name desc',
  'name.1': 'Name asc',
};

export const victimsSortLabelRecord: Record<`${IVictimSort[0]}.${IVictimSort[1]}`, string> = {
  'age.-1': 'Highest age',
  'age.1': 'Lowest age',
  'case_no.-1': 'Highest case no',
  'case_no.1': 'Lowest case no',
  'name.-1': 'Name desc',
  'name.1': 'Name asc',
};

export const createInitialGetAccessesQuery = (): GetAccessesPayload => ({
  limit: 10,
  next: null,
  sort: ['approved', -1],
  filter: {
    approved: [],
    permission: [],
    type: [],
  },
});

export const PermissionIconRecord: Record<TAccessPermission, JSX.Element> = {
  delete: <DeleteIcon style={{
    fill: red[500]
  }} fontSize="small" />,
  update: <EditIcon style={{
    fill: blue[500]
  }} fontSize="small" />,
  read: <VisibilityIcon style={{
    fill: green[500]
  }} fontSize="small" />,
  write: <EditIcon style={{
    fill: blue[500]
  }} fontSize="small" />,
};

export const AccessesFilterGroup = (): FilterFormProps<GetAccessesPayload>["filterGroups"] => {
  return [{
    type: "checkbox_group",
    props: {
      items: [
        ['2', <div key="unapproved">Unapproved</div>],
        ['1', <div key="approved">Approved</div>],
        ['0', <div key="disapproved">Disapproved</div>]
      ],
      label: "Approval",
      stateKey: "approved"
    }
  }, {
    type: "checkbox_group",
    props: {
      items: [
        ['case', <div key="case">Case</div>],
        ['criminal', <div key="criminal">Criminal</div>]
      ],
      label: "Type",
      stateKey: "type"
    }
  }, {
    type: "checkbox_group",
    props: {
      items: [
        ['read', <div key="read">View</div>],
        ['update', <div key="update">Update</div>],
        ['delete', <div key="delete">Delete</div>]
      ],
      label: "Permission",
      stateKey: "permission"
    }
  }]
} 