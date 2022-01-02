import { IAccessSort, IQuery } from "@bupd/types";
import { Typography } from "@mui/material";
import router from "next/router";
import qs from "qs";
import { useGetAccessesQuery } from "../api";
import { accessSortLabelRecord } from "../constants";
import { AccessFilterForm } from "./AccessFilterForm";
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
      return <div className="flex justify-center gap-10 my-5 items-center w-full" style={{ height: "calc(100% - 50px)" }}>
        <div className="h-full px-5">
          <AccessFilterForm />
        </div>

        <div className="flex gap-8 flex-col justify-between w-full h-full">
          <Typography className="uppercase" variant="h4">Access Requests</Typography>
          <div className="flex flex-col gap-3 w-full h-full">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 w-full">
                <Select<number> value={parseInt(query?.limit?.toString() ?? "5", 10)} items={[5, 10, 15, 20, 25]} renderValue={(value) => `${value} per page`} onChange={(event) => {
                  router.push({ pathname: "/", query: qs.stringify({ ...query, limit: event.target.value }) })
                }} />
                <Select<string> value={sortKey.join(".")} items={Object.keys(accessSortLabelRecord)} menuItemRender={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} renderValue={(value) => accessSortLabelRecord[value as keyof typeof accessSortLabelRecord]} onChange={(event) => {
                  router.push({ pathname: "/", query: qs.stringify({ ...query, sort: event.target.value.split(".") }) })
                }} />
              </div>
              <div className="flex gap-3 text-lg">
                Total: <span className="font-bold">{allAccessesItems.length}/{totalItems}</span>
              </div>
            </div>
            <div className="overflow-auto w-full" style={{
              height: 400,
              flexGrow: 1
            }}>
              <AccessList accesses={allAccessesItems} />
            </div>
          </div>
          <LoadMoreButton fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allAccessesItems.length !== totalItems} />
        </div>

      </div>;
    }
    return null;
  }

  return <div className="flex justify-center h-full">{render()}</div>
}