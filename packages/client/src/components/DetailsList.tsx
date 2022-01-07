import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export interface DetailsListProps {
  items: [string, (string | number | JSX.Element)][]
  header?: string
  className?: string
}

export function DetailsList(props: DetailsListProps) {
  return <div className={`flex h-full flex-col gap-5 flex-grow ${props.className ?? ""}`}>
    {props.header && <div className="flex justify-center px-5 py-2 rounded-sm uppercase text-center" style={{
      background: grey[100]
    }}>
      <Typography variant="h5">{props.header}</Typography>
    </div>}
    <div className="flex flex-col gap-2">
      {
        props.items.map(([label, value]) => <div key={`${label}.${value}`} className="flex justify-between">
          <span className="text-md mr-5 capitalize">{label}:</span>
          <span className="font-semibold text-sm text-right capitalize break-words" style={{
            wordBreak: "break-all"
          }}>{value}</span>
        </div>)
      }
    </div>
  </div>
}