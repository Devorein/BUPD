import { MenuItem } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";

interface DropDownMenuProps {
  menuItems: JSX.Element[]
  menuLabel: JSX.Element
}

export function DropDownMenuItem(props: {
  link?: string,
  iconComponent?: JSX.Element,
  label: string
}) {
  const { link, label, iconComponent } = props;
  const router = useRouter();
  return <MenuItem>
    <div tabIndex={0} role="button" onClick={() => router.push(`/${link ?? label.toLowerCase()}`)} className="flex gap-1 p-1 justify-center items-center w-full">
      {iconComponent}
      <span className="capitalize font-semibold">{label}</span>
    </div>
  </MenuItem>
}

export function DropDownMenu(props: DropDownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { menuItems, menuLabel } = props;
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <>
    <div onClick={handleClick} role="button" tabIndex={0}>
      {menuLabel}
    </div>
    <Menu
      transformOrigin={{
        horizontal: "center",
        vertical: "top"
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      className="p-2"
    >
      {menuItems}
    </Menu>
  </>
}