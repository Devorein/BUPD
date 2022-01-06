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
      totalCasefiles += total;
    })

    Object.values(dashboardData.polices).forEach(total => {
      totalPolices += total;
    })
  }

  return dashboardData && !isGetDashboardQueryLoading ? <div className="flex gap-5 w-full h-full">
    <div className="flex gap-5 flex-col">
      <div className="shadow-md border-2 p-5 rounded-md flex flex-col gap-3">
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
        <div className="flex flex-col">
          <Typography variant="h5" className="uppercase">
            Victims
          </Typography>
          <div>Total: <span className="font-bold">{dashboardData.victims}</span></div>
        </div>
        <div className="max-w-[250px]">
          <Button content="View victims" onClick={() => router.push({ pathname: "/victims" })} />
        </div>
      </div>

      <div className="shadow-md border-2 p-5 rounded-md flex flex-col gap-3 justify-between">
        <div className="flex flex-col">
          <Typography variant="h5" className="uppercase">
            Criminals
          </Typography>
          <div>Total: <span className="font-bold">{dashboardData.criminals}</span></div>
        </div>
        <div className="max-w-[250px]">
          <Button content="View criminals" onClick={() => router.push({ pathname: "/criminals" })} />
        </div>
      </div>
    </div>

    <div className="shadow-md border-2 p-5 rounded-md flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <Typography variant="h5" className="uppercase">
          Polices
        </Typography>
        <div>Total: <span className="font-bold">{totalPolices}</span></div>
        <div>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Rank</Typography>
            <DetailsList items={Object.entries(dashboardData.polices)} />
          </div>
        </div>
      </div>
      <div className="max-w-[250px]">
        <Button content="View polices" onClick={() => router.push({ pathname: "/polices" })} />
      </div>
    </div>

    <div className="shadow-md border-2 p-5 rounded-md flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        <Typography variant="h5" className="uppercase">
          Crimes
        </Typography>
        <div>Total: <span className="font-bold">{totalCasefiles}</span></div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Category</Typography>
            <DetailsList items={Object.entries(dashboardData.crimes.categories)} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Weapon</Typography>
            <DetailsList items={Object.entries(dashboardData.crimes.weapons)} />
          </div>
        </div>
      </div>
      <div className="max-w-[250px]">
        <Button content="View casefiles" onClick={() => router.push({ pathname: "/casefiles" })} />
      </div>
    </div>
  </div > : null
}