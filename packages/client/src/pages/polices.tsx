import { GetPolicesPayload, IPolice, IPoliceSort } from "@bupd/types";
import { grey } from "@mui/material/colors";
import { useGetPolicesQuery } from "../api/queries/useGetPolicesQuery";
import { DetailsList } from "../components/DetailsList";
import { Paginate } from "../components/Paginate";
import { policeSortLabelRecord, POLICE_RANKS } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createInitialGetPolicesQuery = (query?: Partial<GetPolicesPayload>): GetPolicesPayload => ({
  limit: 10,
  next: null,
  sort: ["name", -1],
  ...query,
  filter: {
    designation: [],
    rank: [],
    ...(query?.filter ?? {})
  }
})


export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);

  return <Paginate<GetPolicesPayload, IPoliceSort, IPolice> checkboxGroups={[{
    items: POLICE_RANKS.map(policeRank => ([policeRank, <div key={policeRank}>{policeRank}</div>])),
    label: "Rank",
    stateKey: "rank"
  }]} clientQueryFn={createInitialGetPolicesQuery} dataListComponentFn={(polices) => <div className="grid grid-cols-3 gap-5 pr-5">
    {polices.map(police => <div className="border-2 shadow-md rounded-md p-5 flex flex-col gap-5 my-5" key={police.nid}>
      <div className="mt-5 flex justify-center w-full">
        <img className="h-[50px] w-[50px] rounded-full shadow-md" alt="profile" src={"https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg"} />
      </div>
      <div className="justify-center flex font-bold text-2xl">{police.name}</div>
      <div className="flex justify-center mb-2">
        <span className="border-2 px-2 py-1 font-semibold text-sm rounded-md" style={{
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
      ]} />
    </div>)}
  </div>} label="Polices" sortLabelRecord={policeSortLabelRecord} dataFetcher={useGetPolicesQuery} />
}