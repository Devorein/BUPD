import { Checkbox, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { FormElementProps } from "../types";

export interface CheckboxGroupProps<State> extends FormElementProps<State> {
  items: (string | number | [string | number, (ReactNode | ReactNode[])])[]
}

export function CheckboxGroup<State>(props: CheckboxGroupProps<State>) {
  const { items, state, setState, stateKey, label } = props;
  const checkedItems = state[stateKey] as unknown as (string | number)[];
  return <div className="CheckboxGroup flex flex-col gap-3">
    <Typography variant="h5">{label}</Typography>
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const currentLabel = Array.isArray(item) ? item[1] : item, value = Array.isArray(item) ? item[0] : item;
        return <div className="flex items-center" key={value}>
          <Checkbox disableRipple color="secondary" className="cursor-pointer" checked={checkedItems.includes(value)} onClick={(e) => {
            const checked = (e.target as any).checked
            if (checked) {
              setState({
                ...state,
                [stateKey]: [...checkedItems, value]
              })
            } else {
              setState({
                ...state,
                [stateKey]: checkedItems.filter(checkedItem => checkedItem !== value)
              })
            }
          }} />
          <Typography component="div" className="flex-grow capitalize">{currentLabel}</Typography>
        </div>
      })}
    </div>
  </div>
}