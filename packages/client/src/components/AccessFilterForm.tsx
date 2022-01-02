import { IAccessFilter, IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import qs from "qs";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { CheckboxGroup } from "./CheckboxGroup";

const accessFilterInitialValue = (initialAccessFilter?: Partial<IAccessFilter>) => ({
  type: initialAccessFilter?.type ?? [],
  approved: initialAccessFilter?.approved ?? [],
  permission: initialAccessFilter?.permission ?? []
} as IAccessFilter);


export function AccessFilterForm() {
  const [query, setQuery] = useState(accessFilterInitialValue());
  const router = useRouter();
  useEffect(() => {
    const queryParams = qs.parse(router.asPath.slice(2)) as unknown as Partial<IQuery<any, any>> ?? {};
    setQuery(accessFilterInitialValue(queryParams?.filter))
  }, [router])

  return <div className="flex flex-col gap-5">
    <Typography variant="h4">
      Filter
    </Typography>
    <CheckboxGroup<IAccessFilter> items={[
      ['2', <div key="approved">Unapproved</div>],
      ['1', <div key="approved">Approved</div>],
      ['0', <div key="disapproved">Disapproved</div>]
    ]} label="Approval" setState={setQuery} state={query} stateKey="approved" />
    <CheckboxGroup<IAccessFilter> items={[
      ['case', <div key="case">Case</div>],
      ['criminal', <div key="criminal">Criminal</div>]
    ]} label="Type" setState={setQuery} state={query} stateKey="type" />
    <CheckboxGroup<IAccessFilter> items={[
      ['read', <div key="read">View</div>],
      ['update', <div key="update">Update</div>],
      ['delete', <div key="delete">Delete</div>]
    ]} label="Permission" setState={setQuery} state={query} stateKey="permission" />
    <div className="mt-3 flex gap-3">
      <Button color="secondary" content="Apply" onClick={() => {
        router.push({
          pathname: "/",
          query: qs.stringify({ ...(qs.parse(router.asPath.slice(2))), filter: query })
        })
      }} />
      <Button content="Reset" onClick={() => {
        setQuery(accessFilterInitialValue())
      }} />
    </div>
  </div>
}