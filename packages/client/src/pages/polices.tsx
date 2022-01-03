import { GetPolicesPayload, IPoliceSort } from "@bupd/types";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useGetPolicesQuery } from "../api/queries/useGetPolicesQuery";
import { Select } from "../components";
import { LoadMoreButton } from "../components/LoadMoreButton";
import { policeSortLabelRecord } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createInitialGetPolicesQuery = (query?: Partial<GetPolicesPayload>): GetPolicesPayload => ({
  limit: 10,
  next: null,
  sort: ["name", -1],
  ...query,
  filter: {
    designation: [],
    rank: [],
    ...(query?.filter ?? {})
  }
})


export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);

  const [clientQuery, setClientQuery] = useState(createInitialGetPolicesQuery());
  const [dummyQuery, setDummyQuery] = useState<GetPolicesPayload>(
    clientQuery,
  );

  const { hasNextPage, lastFetchedPage, fetchNextPage, data: getAccessesQueryData, totalItems, allItems: allAccessesItems, isFetching } = useGetPolicesQuery(clientQuery);

  function render() {
    if (getAccessesQueryData) {
      return <div className="flex justify-center gap-10 my-5 items-center w-full" style={{ height: "calc(100% - 50px)" }}>
        <div className="flex gap-8 flex-col justify-between w-full h-full">
          <Typography className="uppercase" variant="h4">Polices</Typography>
          <div className="flex flex-col gap-3 w-full h-full">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 w-full">
                <Select<number> value={parseInt(clientQuery.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
                  setClientQuery({
                    ...clientQuery,
                    limit: event.target.value as number
                  })
                }} />
                <Select<string> value={clientQuery.sort.join(".")} items={Object.keys(policeSortLabelRecord)} menuItemRender={(value) => policeSortLabelRecord[value as keyof typeof policeSortLabelRecord]} renderValue={(value) => policeSortLabelRecord[value as keyof typeof policeSortLabelRecord]} onChange={(event) => {
                  setClientQuery({
                    ...clientQuery,
                    sort: event.target.value.split(".") as IPoliceSort
                  })
                }} />
              </div>
              <div className="flex gap-3 text-lg">
                Total: <span className="font-bold">{allAccessesItems.length}/{totalItems}</span>
              </div>
            </div>
          </div>
          <LoadMoreButton payload={clientQuery} fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allAccessesItems.length !== totalItems} />
        </div>
      </div>;
    }
    return null;
  }

  return <div className="flex justify-center h-full">{render()}</div>
}