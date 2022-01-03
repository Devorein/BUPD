import { IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useApiInfiniteQuery } from "../hooks/useApiInfiniteQuery";
import { LoadMoreButton } from "./LoadMoreButton";
import { Select } from "./Select";

interface PaginateProps<ClientQuery extends IQuery<any, any>> {
  clientQueryFn: () => ClientQuery,
  dataFetcher: (query: ClientQuery) => ReturnType<(typeof useApiInfiniteQuery)>
  label: string
  sortLabelRecord: Record<string, string>
}

export function Paginate<ClientQuery extends IQuery<any, any>, Sort extends [string, -1 | 1]>(props: PaginateProps<ClientQuery>) {
  const { label, clientQueryFn, dataFetcher, sortLabelRecord } = props;
  const [clientQuery, setClientQuery] = useState<ClientQuery>(clientQueryFn());
  const [dummyQuery, setDummyQuery] = useState<ClientQuery>(
    clientQuery,
  );

  const { hasNextPage, lastFetchedPage, fetchNextPage, data, totalItems, allItems, isFetching, } = dataFetcher(clientQuery);

  if (data) {
    return <div className="flex justify-center gap-10 py-5 items-center w-full h-full">
      <div className="flex gap-8 flex-col justify-between w-full h-full">
        <Typography className="uppercase" variant="h4">{label}</Typography>
        <div className="flex flex-col gap-3 w-full h-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 w-full">
              <Select<number> value={parseInt(clientQuery.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  limit: event.target.value as number
                })
              }} />
              <Select<string> value={clientQuery.sort.join(".")} items={Object.keys(sortLabelRecord)} menuItemRender={(value) => sortLabelRecord[value]} renderValue={(value) => sortLabelRecord[value]} onChange={(event) => {
                setClientQuery({
                  ...clientQuery,
                  sort: event.target.value.split(".") as Sort
                })
              }} />
            </div>
            <div className="flex gap-3 text-lg">
              Total: <span className="font-bold">{allItems.length}/{totalItems}</span>
            </div>
          </div>
          <div className="overflow-auto w-full" style={{
            height: 'calc(100% - 125px)',
            flexGrow: 1
          }}>
            <div>Data list</div>
          </div>
        </div>
        <LoadMoreButton payload={clientQuery} fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allItems.length !== totalItems} />
      </div>
    </div>;
  }

  return null;
}