import { IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
import { CheckboxGroup, CheckboxGroupProps } from "./CheckboxGroup";

export interface FilterFormProps<ClientQuery extends IQuery<any, any>> {
  setClientQuery: Dispatch<SetStateAction<ClientQuery>>
  clientFilter: ClientQuery["filter"],
  setClientFilter: Dispatch<SetStateAction<ClientQuery["filter"]>>
  resetFilter: () => ClientQuery["filter"]
  checkboxGroups: Omit<CheckboxGroupProps<ClientQuery["filter"]>, "setState" | "state">[]
}

export function FilterForm<ClientQuery extends IQuery<any, any>>(props: FilterFormProps<ClientQuery>) {
  const { checkboxGroups, resetFilter, setClientQuery, clientFilter, setClientFilter } = props;

  return <div className="flex flex-col gap-5 justify-between h-full">
    <Typography variant="h4">
      Filter
    </Typography>
    <div className="flex flex-col gap-5">
      {checkboxGroups.map(checkboxGroup => <CheckboxGroup<ClientQuery["filter"]> key={checkboxGroup.label} items={checkboxGroup.items} label={checkboxGroup.label} setState={setClientFilter} state={clientFilter} stateKey={checkboxGroup.stateKey} />
      )}
    </div>
    <div className="mt-3 flex gap-3">
      <Button color="secondary" content="Apply" onClick={() => {
        setClientQuery(clientQuery => ({ ...clientQuery, filter: clientFilter }))
      }} />
      <Button content="Reset" onClick={() => {
        setClientFilter(resetFilter())
      }} />
    </div>
  </div>
}