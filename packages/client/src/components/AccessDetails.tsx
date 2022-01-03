import { ICasefile, ICriminal, IPolice } from "@bupd/types";
import { Typography } from "@mui/material";
import { DetailsList } from "./DetailsList";

export interface AccessDetailsProps {
  data: ({
    type: "police",
  } & Omit<IPolice, "password">) | ({
    type: "casefile",
  } & ICasefile) | ({
    type: "criminal",
  } & ICriminal) | null
}


export function AccessDetails(props: AccessDetailsProps) {
  const { data } = props;

  function render() {
    if (!data) {
      return <Typography variant="h5" className="text-center uppercase">
        Click links to view details
      </Typography>
    } else if (data.type === "police") {
      return <DetailsList items={[
        ["Name", data.name],
        ["Rank", data.rank],
        ["Designation", data.designation],
        ["Address", data.address],
        ["Email", data.email],
        ["NID", data.nid],
        ["Phone", data.phone],
      ]} header="Police details" />
    } else if (data.type === "casefile") {
      return <DetailsList items={[
        ["Case No", data.case_no],
        ["Location", data.location],
        ["Police NID", data.police_nid],
        ["Priority", data.priority],
        ["Status", data.status],
      ]} header="Case details" />
    }
    return <DetailsList items={[
      ["Criminal ID", data.criminal_id],
      ["Name", data.name],
    ]} header="Criminal Details" />
  }

  return <div className="flex items-center rounded-md justify-center py-8 px-5 h-full min-w-[350px] max-w-[350px] shadow-md" style={{
  }}>
    {render()}
  </div>
}