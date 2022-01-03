import { GetCriminalsPayload, ICriminal, ICriminalSort } from "@bupd/types";
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from "@mui/material/colors";
import { useGetCriminalsQuery } from "../api/queries/useGetCriminalsQuery";
import { DetailsList } from "../components/DetailsList";
import { Paginate } from "../components/Paginate";
import { criminalSortLabelRecord, svgIconSx } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createInitialGetCriminalsQuery = (): GetCriminalsPayload => ({
  limit: 10,
  next: null,
  sort: ["name", -1],
  filter: {
  }
})

export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);

  return <div className="flex justify-center w-full h-full">
    <Paginate<GetCriminalsPayload, ICriminalSort, ICriminal> checkboxGroups={[]} clientQueryFn={createInitialGetCriminalsQuery} dataListComponentFn={(criminals) => <div className="grid grid-cols-5 gap-5 pr-5">
      {criminals.map(criminal => <div className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3" key={criminal.criminal_id}>
        <div>
          <DeleteIcon sx={svgIconSx} className="cursor-pointer absolute" style={{
            fill: red[500]
          }} onClick={() => {
          }} />
        </div>
        <div className="flex justify-center w-full mb-5">
          <img className="h-[50px] w-[50px] rounded-full shadow-md" alt="profile" src={"https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg"} />
        </div>
        <DetailsList items={[
          ["Name", criminal.name],
          ["ID", criminal.criminal_id],
        ]} />
      </div>)}
    </div>} label="Criminals" sortLabelRecord={criminalSortLabelRecord} dataFetcher={useGetCriminalsQuery} />
  </div>
}