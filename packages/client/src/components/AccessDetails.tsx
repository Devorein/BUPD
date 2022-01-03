import { ICasefile, ICriminal, IPolice } from "@bupd/types";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export interface AccessDetailsProps {
  data: ({
    type: "police",
  } & Omit<IPolice, "password">) | ({
    type: "casefile",
  } & ICasefile) | ({
    type: "criminal",
  } & ICriminal) | null
}

interface DetailsListProps {
  items: [string, (string | number)][]
  header: string
}

function DetailsList(props: DetailsListProps) {
  return <div className="flex h-full flex-col gap-5">
    <div className="flex justify-center px-5 py-2 rounded-sm uppercase text-center" style={{
      background: grey[100]
    }}>
      <Typography variant="h5">{props.header}</Typography>
    </div>
    <div className="flex flex-col gap-3">
      {
        props.items.map(([label, value]) => <div key={`${label}.${value}`} className="flex justify-between">
          <span className="font-bold text-lg mr-5">{label}:</span>
          <span className="text-right capitalize font-semibold break-words" style={{
            wordBreak: "break-all"
          }}>{value}</span>
        </div>)
      }
    </div>
  </div>
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