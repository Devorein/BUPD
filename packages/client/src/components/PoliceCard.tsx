import { IPolice } from "@bupd/types";
import { grey } from "@mui/material/colors";
import { DetailsList, DetailsListProps } from "./DetailsList";

interface PoliceCardProps {
  police: IPolice & { reported_cases?: number }
}

export function PoliceCard(props: PoliceCardProps) {
  const { police } = props;

  const items: DetailsListProps["items"] = [
    ["Designation", police.designation],
    ["Address", police.address],
    ["Email", police.email],
    ["NID", police.nid],
    ["Phone", police.phone],
  ]
  if (police.reported_cases) {
    items.push(
      ['Reported Cases', police.reported_cases],
    )
  }

  return <div className="flex flex-col gap-3">
    <div className="flex justify-center w-full mt-3">
      <img className="h-[50px] w-[50px] rounded-full shadow-md" alt="profile" src={"https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg"} />
    </div>
    <div className="justify-center flex font-bold text-2xl">{police.name}</div>
    <div className="flex justify-center mb-3">
      <span className="border-2 px-2 py-1 font-semibold text-sm rounded-md shadow-sm" style={{
        backgroundColor: grey[100]
      }}>
        {police.rank}
      </span>
    </div>
    <DetailsList items={items} />
  </div>
}