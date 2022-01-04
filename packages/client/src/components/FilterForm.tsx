import { IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
import { CheckboxGroup, CheckboxGroupProps } from "./CheckboxGroup";
import { NumberRange, NumberRangeProps } from "./NumberRange";

export interface FilterFormProps<ClientQuery extends IQuery<any, any>> {
  setClientQuery: Dispatch<SetStateAction<ClientQuery>>
  clientFilter: ClientQuery["filter"],
  setClientFilter: Dispatch<SetStateAction<ClientQuery["filter"]>>
  resetFilter: () => ClientQuery["filter"]
  filterGroups: ({
    type: "checkboxgroup",
    props: Omit<CheckboxGroupProps<ClientQuery["filter"]>, "setState" | "state">
  } | {
    type: "numberrange",
    props: Omit<NumberRangeProps<ClientQuery["filter"]>, "setState" | "state">
  })[]
}

export function FilterForm<ClientQuery extends IQuery<any, any>>(props: FilterFormProps<ClientQuery>) {
  const { filterGroups, resetFilter, setClientQuery, clientFilter, setClientFilter } = props;

  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-5">
      <Typography variant="h4">
        Filter
      </Typography>
      <div className="flex flex-col gap-5">
        {filterGroups.map(filterGroup => {
          switch (filterGroup.type) {
            case "checkboxgroup": {
              return <CheckboxGroup<ClientQuery["filter"]> key={filterGroup.props.label} {...filterGroup.props} setState={setClientFilter} state={clientFilter} />
            }
            case "numberrange": {
              return <NumberRange<ClientQuery["filter"]> key={filterGroup.props.label} {...filterGroup.props} setState={setClientFilter} state={clientFilter} />
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    </div>
    <div className="flex gap-3">
      <Button color="secondary" content="Apply" onClick={() => {
        setClientQuery(clientQuery => ({ ...clientQuery, filter: clientFilter }))
      }} />
      <Button content="Reset" onClick={() => {
        setClientFilter(resetFilter())
      }} />
    </div>
  </div>
}