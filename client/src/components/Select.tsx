import { MenuItem, Select as MuiSelect, SelectProps as MuiSelectProps } from "@mui/material";
import { ReactNode } from "react";

export interface SelectProps<Value> extends MuiSelectProps<Value> {
  items: (string | number)[]
  renderValue?: (value: Value) => ReactNode
  className?: string
  menuItemRender?: (item: string | number) => ReactNode
}

export function Select<Value>(props: SelectProps<Value>) {
  const { menuItemRender, renderValue, className = "", defaultValue, items, value, onChange, ...restProps } = props;
  return <MuiSelect<Value>
    {...restProps}
    value={value}
    defaultValue={defaultValue}
    className={`bold rounded-sm ${className}`}
    renderValue={(valueToRender) =>
    (
      <div className="SelectRenderedValue font-semibold capitalize rounded-md">
        {renderValue ? renderValue(valueToRender) : valueToRender}
      </div>
    )
    }
    sx={{
      "& .MuiSvgIcon-root": {
        fill: `black`,
        fontSize: 30
      },
    }}
    onChange={onChange}
  >
    {items.map((item) => (
      <MenuItem
        className="capitalize"
        key={item}
        value={item}
      >
        {menuItemRender ? menuItemRender(item) : item}
      </MenuItem>
    ))}
  </MuiSelect>
}