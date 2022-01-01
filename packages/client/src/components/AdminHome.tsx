import { IAccessSort, IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import router from "next/router";
import qs from "qs";
import { useGetAccessesQuery } from "../api";
import { accessSortLabelRecord } from "../constants";
import { AccessList } from "./AccessList";
import { LoadMoreButton } from "./LoadMoreButton";
import { Select } from "./Select";

export function AdminHome() {
  const query = qs.parse(router.asPath.slice(2)) as unknown as Partial<IQuery<any, any>> ?? {};
  // Next should not be part of query key
  if (query) {
    delete query.next;
  }
  const { hasNextPage, lastFetchedPage, fetchNextPage, data: getAccessesQueryData, totalItems, allItems: allAccessesItems, isFetching } = useGetAccessesQuery(query);

  let sortKey: IAccessSort = ["permission", -1];
  if (query.sort) {
    sortKey = query.sort
  }

  function render() {
    if (getAccessesQueryData) {
      return <div className="flex justify-center flex-col gap-3 my-5 items-center w-3/4">
        <div className="mb-5">
          <Typography className="uppercase" variant="h5">Access Requests</Typography>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3">
            <Select<number> value={parseInt(query?.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
              router.push({ pathname: "/", query: qs.stringify({ ...query, limit: event.target.value }) })
            }} />
            <Select<string> value={sortKey.join(".")} items={Object.keys(accessSortLabelRecord)} menuItemRender={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} renderValue={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} onChange={(event) => {
              router.push({ pathname: "/", query: qs.stringify({ ...query, sort: event.target.value.split(".") }) })
            }} />
          </div>
          <div>
            Total: <span className="font-bold">{allAccessesItems.length}/{totalItems}</span>
          </div>
        </div>
        <div className="overflow-auto pr-5 w-full" style={{
          height: 400
        }}>
          <AccessList accesses={allAccessesItems} />
        </div>
        <LoadMoreButton fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allAccessesItems.length !== totalItems} />
      </div>;
    }
    return null;
  }

  return <div className="flex justify-center">{render()}</div>
}