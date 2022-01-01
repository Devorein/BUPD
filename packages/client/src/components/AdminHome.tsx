import { Typography } from "@mui/material";
import { useGetAccessesQuery } from "../api";
import { AccessList } from "./AccessList";
import { LoadMoreButton } from "./LoadMoreButton";

export function AdminHome() {
  const { hasNextPage, lastFetchedPage, fetchNextPage, data: getAccessesQueryData, totalItems, allItems: allAccessesItems, isFetching } = useGetAccessesQuery();

  function render() {
    if (getAccessesQueryData) {
      return <div className="flex justify-center flex-col gap-3 my-5 items-center">
        <Typography className="uppercase" variant="h5">Access Requests</Typography>
        <div className="flex justify-between">
          <div>
            Total: <span className="font-semibold">{allAccessesItems.length}/{totalItems}</span>
          </div>
        </div>
        <div className="overflow-auto px-5" style={{
          height: 450
        }}>
          <AccessList accesses={allAccessesItems} />
        </div>
        <LoadMoreButton fetchNextPage={fetchNextPage} isQueryFetching={isFetching} lastFetchedPage={lastFetchedPage} hasNextPage={hasNextPage && allAccessesItems.length !== totalItems} />
      </div>;
    }
    return null;
  }

  return <div>{render()}</div>
}