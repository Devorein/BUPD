import { IAccess } from "@bupd/types";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { green, red } from "@mui/material/colors";
import React, { useContext } from "react";
import { useUpdateAccessMutation, useUpdateAccessMutationCache } from "../api/mutations/useUpdateAccessMutation";
import { svgIconSx } from "../constants";
import { RootContext } from "../contexts";

interface ApprovalIconsProps {
  approved: IAccess["approved"]
  accessId: number
  hoverable?: boolean
}

export function ApprovalIcons(props: ApprovalIconsProps) {
  const { approved, accessId, hoverable = true } = props;
  const updateAccessMutation = useUpdateAccessMutation(accessId);
  const updateAccessMutationCache = useUpdateAccessMutationCache();
  const { currentUser } = useContext(RootContext);

  let approvalIcons: JSX.Element | null = null;

  switch (approved) {
    case 0: {
      approvalIcons = <>
        <ThumbDownIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 2
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...(hoverable ? svgIconSx : {})
        }} />
        <ThumbUpOutlinedIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 1
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...(hoverable ? svgIconSx : {})
        }} />
      </>
      break;
    }
    case 1: {
      approvalIcons = <>
        <ThumbDownOutlinedIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 0
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...(hoverable ? svgIconSx : {})
        }} />
        <ThumbUpIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 2
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...(hoverable ? svgIconSx : {})
        }} />
      </>
      break;
    }
    default: {
      approvalIcons = <>
        <ThumbDownOutlinedIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 0
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: red[500],
          ...(hoverable ? svgIconSx : {})
        }} />
        <ThumbUpOutlinedIcon onClick={() => {
          if (currentUser?.type === "admin") {
            updateAccessMutation.mutate({
              approved: 1
            }, updateAccessMutationCache(accessId))
          }
        }} className="cursor-pointer" fontSize="small" sx={{
          fill: green[500],
          ...(hoverable ? svgIconSx : {})
        }} />
      </>
      break;
    }
  }
  return <div className="flex gap-2 items-center">{approvalIcons}</div>
}