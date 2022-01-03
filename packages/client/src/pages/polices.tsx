import { GetPolicesPayload, IPolice, IPoliceSort } from "@bupd/types";
import DeleteIcon from '@mui/icons-material/Delete';
import { grey, red } from "@mui/material/colors";
import { useState } from "react";
import { useDeletePoliceMutation, useDeletePoliceMutationCache } from "../api/mutations/useDeletePoliceMutation";
import { useGetPolicesQuery } from "../api/queries/useGetPolicesQuery";
import { Button } from "../components";
import { DetailsList } from "../components/DetailsList";
import { TransitionedModal } from "../components/Modal";
import { Paginate } from "../components/Paginate";
import { policeSortLabelRecord, POLICE_RANKS, svgIconSx } from "../constants";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolice, setSelectedPolice] = useState<IPolice | null>(null)
  const deletePoliceMutation = useDeletePoliceMutation();
  const deletePoliceMutationCache = useDeletePoliceMutationCache();

  return <div className="flex justify-center w-full h-full">
    <TransitionedModal isModalOpen={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      setSelectedPolice(null);
    }}>
      <div className="p-5 flex flex-col gap-5">
        <div className="text-center text-2xl font-bold uppercase">
          Are you sure you want to delete?
        </div>
        <div className="text-center text-md font-medium">This action can&apos;t be reversed</div>
        <div className="flex justify-between mt-5">
          <Button content="Confirm" disabled={deletePoliceMutation.isLoading || !selectedPolice} color="secondary" onClick={() => {
            if (selectedPolice) {
              deletePoliceMutation.mutate({
                endpoint: `police/${selectedPolice.nid}`
              }, deletePoliceMutationCache(selectedPolice.nid, () => {
                setIsModalOpen(false);
                setSelectedPolice(null);
              }))
            }
          }} />
          <Button disabled={deletePoliceMutation.isLoading || !selectedPolice} content="Cancel" />
        </div>
      </div>
    </TransitionedModal>
    <Paginate<GetPolicesPayload, IPoliceSort, IPolice> checkboxGroups={[{
      items: POLICE_RANKS.map(policeRank => ([policeRank, <div key={policeRank}>{policeRank}</div>])),
      label: "Rank",
      stateKey: "rank"
    }]} clientQueryFn={createInitialGetPolicesQuery} dataListComponentFn={(polices) => <div className="grid grid-cols-3 gap-5 pr-5">
      {polices.map(police => <div className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3 my-5" key={police.nid}>
        <div>
          <DeleteIcon sx={svgIconSx} className="cursor-pointer absolute" style={{
            fill: red[500]
          }} onClick={() => {
            setIsModalOpen(true);
            setSelectedPolice(police);
          }} />
        </div>
        <div className="flex justify-center w-full">
          <img className="h-[50px] w-[50px] rounded-full shadow-md" alt="profile" src={"https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg"} />
        </div>
        <div className="justify-center flex font-bold text-2xl">{police.name}</div>
        <div className="flex justify-center mb-3">
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
  </div>
}