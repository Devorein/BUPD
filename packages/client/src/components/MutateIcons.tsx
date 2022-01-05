import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { blue, red } from "@mui/material/colors";
import { MouseEventHandler } from "react";
import { svgIconSx } from "../constants";

interface MutateIconsProps {
  onUpdateIconClick: MouseEventHandler<SVGSVGElement>
  onDeleteIconClick: MouseEventHandler<SVGSVGElement>
}

export function MutateIcons(props: MutateIconsProps) {
  const { onDeleteIconClick, onUpdateIconClick } = props;

  return <div className="flex gap-1 absolute items-center">
    <DeleteIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
      fill: red[500]
    }} onClick={onDeleteIconClick} />
    <EditIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
      fill: blue[500]
    }} onClick={onUpdateIconClick} />
  </div>
}