import { PRIORITY_RECORD } from "@bupd/constants";
import { Typography } from "@mui/material";
import router from "next/router";
import { useGetDashboardQuery } from "../api/queries/useGetDashboardQuery";
import { useIsAuthenticated } from "../hooks";
import { Button } from "./Button";
import { DetailsList } from "./DetailsList";

interface DashboardItemProps {
  label: string
  children?: JSX.Element | JSX.Element[]
  total: number
}

function DashboardItem(props: DashboardItemProps) {
  const currentUser = useIsAuthenticated();
  const { label, total, children } = props;
  return <div className="shadow-md border-2 p-5 rounded-md flex flex-col justify-between gap-3">
    <div className="flex flex-col gap-2">
      <Typography variant="h5" className="uppercase">
        {label}
      </Typography>
      <div>Total: <span className="font-bold">{total}</span></div>
      {children && <div className="flex gap-10">
        {children}
      </div>}
    </div>
    <Button style={{
      width: 'fit-content'
    }} content={`View ${label.toLowerCase()}`} onClick={() => router.push({ pathname: `${currentUser.type}/${label.toLowerCase()}` })} />
  </div>
}

export function Dashboard() {
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

  return dashboardData && !isGetDashboardQueryLoading ? <div className="flex gap-3 w-full h-full">
    <div className="flex gap-3 flex-col">
      <DashboardItem label="Casefiles" total={totalCasefiles}>
        <div className="flex flex-col gap-1">
          <Typography variant="h6">Status</Typography>
          <div>
            <DetailsList items={Object.entries(dashboardData.casefiles.status)} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="h6">Priority</Typography>
          <div>
            <DetailsList items={Object.entries(dashboardData.casefiles.priority).map(([priority, total]) => [PRIORITY_RECORD[priority]!, total])} />
          </div>
        </div>
      </DashboardItem>

      <DashboardItem total={dashboardData.victims} label="Victims" />
      <DashboardItem total={dashboardData.criminals} label="Criminals" />
    </div>

    <DashboardItem label="Polices" total={totalPolices}>
      <div className="flex flex-col gap-1">
        <Typography variant="h6">Rank</Typography>
        <DetailsList items={Object.entries(dashboardData.polices)} />
      </div>
    </DashboardItem>

    <DashboardItem label="Crimes" total={totalCasefiles}>
      <div className="flex flex-col gap-1 min-w-[150px]">
        <Typography variant="h6">Category</Typography>
        <DetailsList items={Object.entries(dashboardData.crimes.category)} />
      </div>
      <div className="flex flex-col gap-1 min-w-[250px]">
        <Typography variant="h6">Weapon</Typography>
        <DetailsList items={Object.entries(dashboardData.crimes.weapon)} />
      </div>
    </DashboardItem>
  </div > : null
}