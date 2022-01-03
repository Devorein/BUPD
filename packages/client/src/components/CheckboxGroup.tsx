import { Checkbox, Typography } from "@mui/material";
import React, { Dispatch, ReactNode, SetStateAction } from "react";

export interface CheckboxGroupProps<State> {
  items: (string | number | [string | number, (ReactNode | ReactNode[])])[]
  setState: Dispatch<SetStateAction<State>>
  state: State
  stateKey: keyof State
  label: string
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
          <Checkbox color="secondary" checked={checkedItems.includes(value)} onClick={(e) => {
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
          <Typography component="div" className="flex-grow">{currentLabel}</Typography>
        </div>
      })}
    </div>
  </div>
}