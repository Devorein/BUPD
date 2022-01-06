import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { blue, red } from "@mui/material/colors";
import { MouseEventHandler } from "react";
import { svgIconSx } from "../constants";

interface MutateIconsProps {
  onUpdateIconClick: MouseEventHandler<SVGSVGElement>
  onDeleteIconClick: MouseEventHandler<SVGSVGElement>
  showUpdateIcon?: boolean
  showDeleteIcon?: boolean
}

export function MutateIcons(props: MutateIconsProps) {
  const { showDeleteIcon = true, showUpdateIcon = true, onDeleteIconClick, onUpdateIconClick } = props;

  if (!showDeleteIcon && !showUpdateIcon) {
    return null;
  }

  return <div className="flex gap-1 items-center">
    {showDeleteIcon && <DeleteIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
      fill: red[500]
    }} onClick={onDeleteIconClick} />}
    {showUpdateIcon && <EditIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
      fill: blue[500]
    }} onClick={onUpdateIconClick} />}
  </div>
}