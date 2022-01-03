import { GetAccessesPayload, IAccessFilter } from "@bupd/types";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
import { CheckboxGroup } from "./CheckboxGroup";

const accessFilterInitialValue = (initialAccessFilter?: Partial<IAccessFilter>) => ({
  type: initialAccessFilter?.type ?? [],
  approved: initialAccessFilter?.approved ?? [],
  permission: initialAccessFilter?.permission ?? []
} as IAccessFilter);

interface AccessFilterFormProps {
  setClientQuery: Dispatch<SetStateAction<GetAccessesPayload>>
  clientFilter: GetAccessesPayload["filter"],
  setClientFilter: Dispatch<SetStateAction<GetAccessesPayload["filter"]>>
}

export function AccessFilterForm(props: AccessFilterFormProps) {
  const { setClientQuery, clientFilter, setClientFilter } = props;

  return <div className="flex flex-col gap-5 justify-between h-full">
    <Typography variant="h4">
      Filter
    </Typography>
    <div className="flex flex-col gap-5">
      <CheckboxGroup<IAccessFilter> items={[
        ['2', <div key="approved">Unapproved</div>],
        ['1', <div key="approved">Approved</div>],
        ['0', <div key="disapproved">Disapproved</div>]
      ]} label="Approval" setState={setClientFilter} state={clientFilter} stateKey="approved" />
      <CheckboxGroup<IAccessFilter> items={[
        ['case', <div key="case">Case</div>],
        ['criminal', <div key="criminal">Criminal</div>]
      ]} label="Type" setState={setClientFilter} state={clientFilter} stateKey="type" />
      <CheckboxGroup<IAccessFilter> items={[
        ['read', <div key="read">View</div>],
        ['update', <div key="update">Update</div>],
        ['delete', <div key="delete">Delete</div>]
      ]} label="Permission" setState={setClientFilter} state={clientFilter} stateKey="permission" />
    </div>
    <div className="mt-3 flex gap-3">
      <Button color="secondary" content="Apply" onClick={() => {
        setClientQuery(clientQuery => ({ ...clientQuery, filter: clientFilter }))
      }} />
      <Button content="Reset" onClick={() => {
        setClientFilter(accessFilterInitialValue())
      }} />
    </div>
  </div>
}