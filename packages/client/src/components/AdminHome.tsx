import { Typography } from "@mui/material";
import router from "next/router";
import { useGetAccessesQuery } from "../api";
import { AccessList } from "./AccessList";

export function AdminHome() {
  const { filter: filterKey, sort: sortKey, limit: limitKey } = router.query as { filter?: string, sort?: string, limit?: string };
  const queryParams: string[] = [];
  if (limitKey) {
    queryParams.push(`limit=${limitKey}`)
  }
  if (sortKey) {
    queryParams.push(`sort=${sortKey}`)
  }

  const { data: getAccessesQueryData } = useGetAccessesQuery(queryParams.join("&"));

  function render() {
    if (getAccessesQueryData) {
      if (getAccessesQueryData.status === "success") {
        return <div className="flex justify-center flex-col gap-5 my-5 items-center">
          <div className="mb-5 text-center">
            <Typography className="uppercase" variant="h5">Access Requests</Typography>
          </div>
          <AccessList accesses={getAccessesQueryData.data.items} />
        </div>;
      }
    }
    return null;
  }

  return <div>{render()}</div>
}