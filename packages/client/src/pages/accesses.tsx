import { GetAccessesPayload, IAccessSort } from "@bupd/types";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useGetAccessesQuery } from "../api";
import { Select } from "../components";
import { AccessDetails, AccessDetailsProps } from "../components/AccessDetails";
import { AccessFilterForm } from "../components/AccessFilterForm";
import { AccessList } from "../components/AccessList";
import { LoadMoreButton } from "../components/LoadMoreButton";
import { accessSortLabelRecord } from "../constants";

const createInitialGetAccessesQuery = (query?: Partial<GetAccessesPayload>): GetAccessesPayload => ({
  limit: 10,
  next: null,
  sort: ["approved", -1],
  ...query,
  filter: {
    approved: [],
    permission: [],
    type: [],
    ...(query?.filter ?? {})
  }
})

export default function Accesses() {
  const [clientQuery, setClientQuery] = useState(createInitialGetAccessesQuery());
  const [dummyQuery, setDummyQuery] = useState<GetAccessesPayload>(
    clientQuery,
  );

  const { hasNextPage, lastFetchedPage, fetchNextPage, data: getAccessesQueryData, totalItems, allItems: allAccessesItems, isFetching } = useGetAccessesQuery(clientQuery);

  const [currentDetail, setAccessDetail] = useState<AccessDetailsProps["data"]>(null)

  if (getAccessesQueryData) {
    return <div className="flex justify-center gap-10 py-5 items-center w-full h-full">
      <div className="h-full px-5">
        <AccessFilterForm clientFilter={dummyQuery.filter} setClientFilter={(clientFilter) => {
          setDummyQuery({
            ...clientQuery,
            filter: clientFilter as GetAccessesPayload["filter"]
          })
        }} setClientQuery={setClientQuery} />
      </div>

      <div className="flex gap-8 flex-col justify-between w-full h-full">
        <Typography className="uppercase" variant="h4">Access Requests</Typography>
        <div className="flex flex-col gap-3 w-full h-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 w-full">
              <Select<number> value={parseInt(clientQuery.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  limit: event.target.value as number
                })
              }} />
              <Select<string> value={clientQuery.sort.join(".")} items={Object.keys(accessSortLabelRecord)} menuItemRender={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} renderValue={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  sort: event.target.value.split(".") as IAccessSort
                })
              }} />
            </div>
            <div className="flex gap-3 text-lg">
              Total: <span className="font-bold">{allAccessesItems.length}/{totalItems}</span>
            </div>
          </div>
          <div className="overflow-auto w-full" style={{
            height: 'calc(100% - 125px)',
            flexGrow: 1
          }}>
            <AccessList accesses={allAccessesItems} setAccessDetail={setAccessDetail} />
          </div>
        </div>
        <LoadMoreButton payload={clientQuery} fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allAccessesItems.length !== totalItems} />
      </div>
      <AccessDetails data={currentDetail} />
    </div>;
  }

  return null;
}