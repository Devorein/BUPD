import { POLICE_RANKS } from "@bupd/constants";
import { GetPolicesPayload, IPolice, IPoliceSort } from "@bupd/types";
import { PoliceRequest } from "@bupd/validation";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { blue, grey, red } from "@mui/material/colors";
import { useDeletePoliceMutation, useDeletePoliceMutationCache } from "../api/mutations/useDeletePoliceMutation";
import { useGetPolicesQuery } from "../api/queries/useGetPolicesQuery";
import { DeleteModal } from "../components/DeleteModal";
import { DetailsList } from "../components/DetailsList";
import { Paginate } from "../components/Paginate";
import { policeSortLabelRecord, svgIconSx } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createInitialGetPolicesQuery = (): GetPolicesPayload => ({
  limit: 10,
  next: null,
  sort: ["name", -1],
  filter: {
    designation: [],
    rank: [],
  }
})

const updatePolicePayloadValidationSchema = PoliceRequest.update("client");

export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["admin"]);

  const deletePoliceMutation = useDeletePoliceMutation();
  const deletePoliceMutationCache = useDeletePoliceMutationCache();

  return <div className="flex justify-center w-full h-full">
    <DeleteModal<IPolice> isMutationLoading={deletePoliceMutation.isLoading} onDelete={(selectedData, closeModal) => {
      deletePoliceMutation.mutate({
        endpoint: `police/${selectedData.nid}`
      }, deletePoliceMutationCache(selectedData.nid, () => {
        closeModal()
      }))
    }}>
      {({
        openModal
      }) => <Paginate<GetPolicesPayload, IPoliceSort, IPolice> filterGroups={[{
        type: "checkbox_group",
        props: {
          items: POLICE_RANKS.map(policeRank => ([policeRank, <div key={policeRank}>{policeRank}</div>])),
          label: "Rank",
          stateKey: "rank"
        }
      }]} clientQueryFn={createInitialGetPolicesQuery} dataListComponentFn={(polices) => <div className="grid grid-cols-3 gap-5 pr-5">
        {polices.map(police => <div className="border-2 shadow-md relative rounded-md p-5 flex flex-col gap-3" key={police.nid}>
          <div className="flex gap-1 absolute">
            <DeleteIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
              fill: red[500]
            }} onClick={() => {
              openModal(police)
            }} />
            <EditIcon sx={svgIconSx} fontSize="small" className="cursor-pointer" style={{
              fill: blue[500]
            }} />
          </div>
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
          ]} />
        </div>)}
      </div>} label="Polices" sortLabelRecord={policeSortLabelRecord} dataFetcher={useGetPolicesQuery} />}
    </DeleteModal>
  </div>
}