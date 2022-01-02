import { IAccess, IAccessPopulated, TAccessPermission } from "@bupd/types";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkIcon from '@mui/icons-material/Work';
import { green, red } from "@mui/material/colors";
import { Dispatch, SetStateAction } from "react";
import { useUpdateAccessMutation, useUpdateAccessMutationCache } from "../api/mutations/useUpdateAccessMutation";
import { svgIconSx } from "../constants";
import { AccessDetailsProps } from "./AccessDetails";

interface AccessListProps {
  accesses: IAccessPopulated[]
  setAccessDetail: Dispatch<SetStateAction<AccessDetailsProps["data"]>>
}

const PermissionIconRecord: Record<TAccessPermission, JSX.Element> = {
  delete: <DeleteIcon fontSize="small" />,
  update: <EditIcon fontSize="small" />,
  read: <VisibilityIcon fontSize="small" />,
  write: <EditIcon fontSize="small" />,
}

interface ApprovalIconsProps {
  approved: IAccess["approved"]
  accessId: number
}

function ApprovalIcons(props: ApprovalIconsProps) {
  const { approved, accessId } = props;
  const updateAccessMutation = useUpdateAccessMutation(accessId);
  const updateAccessMutationCache = useUpdateAccessMutationCache();

  let approvalIcons: JSX.Element | null = null;

  switch (approved) {
    case 0: {
      approvalIcons = <>
        <ThumbDownIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 2
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...svgIconSx
        }} />
        <ThumbUpOutlinedIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 1
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...svgIconSx
        }} />
      </>
      break;
    }
    case 1: {
      approvalIcons = <>
        <ThumbDownOutlinedIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 0
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...svgIconSx
        }} />
        <ThumbUpIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 2
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...svgIconSx
        }} />
      </>
      break;
    }
    default: {
      approvalIcons = <>
        <ThumbDownOutlinedIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 0
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...svgIconSx
        }} />
        <ThumbUpOutlinedIcon onClick={() => {
          updateAccessMutation.mutate({
            approved: 1
          }, updateAccessMutationCache(accessId))
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...svgIconSx
        }} />
      </>
      break;
    }
  }
  return <div className="flex gap-2 items-center">{approvalIcons}</div>
}

export function AccessList(props: AccessListProps) {
  const { accesses, setAccessDetail } = props;
  return <div className="flex gap-5 px-5 flex-col overflow-hidden">{
    accesses.map((access, accessIndex) => <div key={access.access_id} className="hover:scale-[1.015] transition-transform duration-300 items-center flex gap-3 border-2 shadow-md p-5 rounded-sm justify-between" style={{ borderColor: '#dad8d85e' }}>
      <div className="flex gap-3 items-center">
        <div className="font-bold">{accessIndex + 1}.</div>
        <div className="text-lg font-semibold hover:underline cursor-pointer" onClick={() => {
          setAccessDetail({
            type: "police",
            ...access.police
          })
        }}>{access.police_nid}</div>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2">Requesting {PermissionIconRecord[access.permission]}  access</div>
        <div className="flex items-center gap-2">to <span onClick={() => {
          if (access.type === "criminal") {
            setAccessDetail({
              type: "criminal",
              ...access.criminal!
            })
          } else if (access.type === "case") {
            setAccessDetail({
              type: "casefile",
              ...access.casefile!
            })
          }
        }} className="flex items-center gap-1 uppercase font-bold hover:underline cursor-pointer text-sm">{access.type === "criminal" ? <AccountBoxIcon fontSize="small" /> : <WorkIcon fontSize="small" />} {access.type === "case" ? access.case_no : access.criminal_id}</span></div>
      </div>
      <ApprovalIcons accessId={access.access_id} approved={access.approved} />
    </div>)
  }</div>
}