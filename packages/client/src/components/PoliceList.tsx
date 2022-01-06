import { POLICE_RANKS } from "@bupd/constants";
import { GetPolicesPayload, IPolice, IPolicePopulated, IPoliceSort } from "@bupd/types";
import { grey } from "@mui/material/colors";
import { useGetPolicesQuery } from "../api/queries/useGetPolicesQuery";
import { policeSortLabelRecord } from "../constants";
import { DetailsList } from "./DetailsList";
import { Paginate } from "./Paginate";
import { SelectTags } from "./SelectTags";

const createInitialGetPolicesQuery = (): GetPolicesPayload => ({
  limit: 10,
  next: null,
  sort: ["name", -1],
  filter: {
    designation: [],
    rank: [],
    search: []
  }
})

interface PoliceListProps {
  mutateIcons?: (police: IPolice) => JSX.Element
}

export function PoliceList(props: PoliceListProps) {
  const { mutateIcons } = props;
  return <Paginate<GetPolicesPayload, IPoliceSort, IPolicePopulated> searchBarPlaceholder="Search by nid. Eg:- 10000 12340" filterGroups={[{
    type: "select",
    props: {
      items: POLICE_RANKS,
      label: "Rank",
      stateKey: "rank",
      multiple: true,
      renderValue: (renderValues) => <SelectTags values={renderValues} />
    }
  }]} clientQueryFn={createInitialGetPolicesQuery} dataListComponentFn={(polices) => <div className="grid grid-cols-3 gap-5 pr-5">
    {polices.map(police => <div className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3" key={police.nid}>
      {mutateIcons && mutateIcons(police)}
      <div className="flex justify-center w-full">
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
      <DetailsList items={[
        ["Designation", police.designation],
        ["Address", police.address],
        ["Email", police.email],
        ["NID", police.nid],
        ["Phone", police.phone],
        ["Reported Cases", police.reported_cases],
      ]} />
    </div>)}
  </div>} label="Polices" sortLabelRecord={policeSortLabelRecord} dataFetcher={useGetPolicesQuery} />
}