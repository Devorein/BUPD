import { PRIORITY_RECORD } from "@bupd/constants";
import { TCasefilePriority } from "@bupd/types";
import { Typography } from "@mui/material";
import router from "next/router";
import { useGetDashboardQuery } from "../api/queries/useGetDashboardQuery";
import { useIsAuthenticated } from "../hooks";
import { Button } from "./Button";
import { DetailsList } from "./DetailsList";

export function Dashboard() {
  useIsAuthenticated();
  const { data: getDashboardQueryData, isLoading: isGetDashboardQueryLoading } = useGetDashboardQuery();
  const dashboardData = getDashboardQueryData?.status === "success" ? getDashboardQueryData.data : null;

  let totalCasefiles = 0;
  let totalPolices = 0;

  if (dashboardData) {
    Object.values(dashboardData.casefiles.status).forEach(total => {
      totalCasefiles += total
    })

    Object.values(dashboardData.polices).forEach(total => {
      totalPolices += total
    })
  }

  return dashboardData && !isGetDashboardQueryLoading ? <div className="flex flex-col gap-5 w-full h-full">
    <div className="flex gap-5">
      <div className="shadow-md border-2 p-5 rounded-md flex flex-col gap-5">
        <Typography variant="h5" className="uppercase">
          Casefiles
        </Typography>
        <div>Total: <span className="font-bold">{totalCasefiles}</span></div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Status</Typography>
            <div>
              <DetailsList items={Object.entries(dashboardData.casefiles.status)} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Priority</Typography>
            <div>
              <DetailsList items={Object.entries(dashboardData.casefiles.priority).map(([priority, total]) => [PRIORITY_RECORD[priority as unknown as TCasefilePriority], total])} />
            </div>
          </div>
        </div>
        <Button content="View casefiles" onClick={() => router.push({ pathname: "/casefiles" })} />
      </div>
      <div className="shadow-md border-2 p-5 rounded-md flex flex-col gap-3 justify-between">
        <Typography variant="h5" className="uppercase">
          Polices
        </Typography>
        <div>Total: <span className="font-bold">{totalPolices}</span></div>
        <div>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Rank</Typography>
            <div className="grid grid-cols-2 gap-10">
              <DetailsList items={Object.entries(dashboardData.polices).slice(0, 3)} />
              <DetailsList items={Object.entries(dashboardData.polices).slice(4, 6)} />
            </div>
          </div>
        </div>
        <div className="w-[250px]">
          <Button content="View polices" onClick={() => router.push({ pathname: "/polices" })} />
        </div>
      </div>
    </div>
    <div className="flex gap-5">
      <div className="shadow-md border-2 p-5 rounded-md flex flex-col gap-3 justify-between">
        <Typography variant="h5" className="uppercase">
          Crimes
        </Typography>
        <div>Total: <span className="font-bold">{totalCasefiles}</span></div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Category</Typography>
            <div className="flex gap-5">
              <DetailsList items={Object.entries(dashboardData.crimes.categories).slice(0, 3)} />
              <DetailsList items={Object.entries(dashboardData.crimes.categories).slice(3)} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Weapon</Typography>
            <div className="flex gap-5">
              <DetailsList items={Object.entries(dashboardData.crimes.weapons).slice(0, 3)} />
              <DetailsList items={Object.entries(dashboardData.crimes.weapons).slice(3, 6)} />
              <DetailsList items={Object.entries(dashboardData.crimes.weapons).slice(6)} />
            </div>
          </div>
        </div>
        <div className="w-[250px]">
          <Button content="View casefiles" onClick={() => router.push({ pathname: "/casefiles" })} />
        </div>
      </div>

      <div className="shadow-md border-2 flex-grow p-5 rounded-md flex flex-col gap-3 justify-between">
        <div className="flex flex-col gap-3">
          <Typography variant="h5" className="uppercase">
            Victims
          </Typography>
          <div>Total: <span className="font-bold">{dashboardData.victims}</span></div>
        </div>
        <div className="w-[250px]">
          <Button content="View victims" onClick={() => router.push({ pathname: "/victims" })} />
        </div>
      </div>

      <div className="shadow-md border-2 flex-grow p-5 rounded-md flex flex-col gap-3 justify-between">
        <div className="flex flex-col gap-3">
          <Typography variant="h5" className="uppercase">
            Criminals
          </Typography>
          <div>Total: <span className="font-bold">{dashboardData.criminals}</span></div>
        </div>
        <div className="w-[250px]">
          <Button content="View criminals" onClick={() => router.push({ pathname: "/criminals" })} />
        </div>
      </div>

    </div>
  </div> : null
}