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
  let finalValue: Value | undefined = value;

  if (typeof value === "string" && value === "") {
    finalValue = defaultValue as Value
  } else if (Array.isArray(value) && value.length === 0) {
    finalValue = defaultValue as Value
  }

  return <MuiSelect<Value>
    {...restProps}
    value={finalValue}
    defaultValue={defaultValue}
    className={`bold rounded-sm shadow-md ${className}`}
    renderValue={(valueToRender) =>
    (
      renderValue ? renderValue(valueToRender) : valueToRender
    )
    }
    sx={{
      "& .MuiSvgIcon-root": {
        fill: `black`,
      }
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