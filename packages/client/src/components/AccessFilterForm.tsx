import { IAccessFilter } from "@bupd/types";
import { Typography } from "@mui/material";
import { useState } from "react";
import { Button } from "./Button";
import { CheckboxGroup } from "./CheckboxGroup";

const accessFilterInitialValue = () => ({
  access_type: [],
  approved: [],
  permission: []
} as IAccessFilter);


export function AccessFilterForm() {
  const [query, setQuery] = useState(accessFilterInitialValue())
  return <div className="flex flex-col gap-3">
    <Typography variant="h5">
      Filter
    </Typography>
    <CheckboxGroup<IAccessFilter> items={[
      [0, <div key="approved">Approved</div>],
      [10, <div key="disapproved">Disapproved</div>]
    ]} label="Approval" setState={setQuery} state={query} stateKey="approved" />
    <CheckboxGroup<IAccessFilter> items={[
      ['case', <div key="case">Case</div>],
      ['criminal', <div key="criminal">Criminal</div>]
    ]} label="Type" setState={setQuery} state={query} stateKey="access_type" />
    <CheckboxGroup<IAccessFilter> items={[
      ['read', <div key="read">View</div>],
      ['update', <div key="update">Update</div>],
      ['delete', <div key="delete">Delete</div>]
    ]} label="Permission" setState={setQuery} state={query} stateKey="permission" />
    <div className="mt-3">
      <Button color="secondary" content="Apply" />
    </div>
  </div>
}