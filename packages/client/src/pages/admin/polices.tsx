import { POLICE_RANKS } from "@bupd/constants";
import { GetPolicesPayload, IPolice, IPolicePopulated, IPoliceSort, UpdatePolicePayload } from "@bupd/types";
import { PoliceRequest } from "@bupd/validation";
import { grey } from "@mui/material/colors";
import { useDeletePoliceMutation, useDeletePoliceMutationCache } from "../../api/mutations/useDeletePoliceMutation";
import { useUpdatePoliceMutation, useUpdatePoliceMutationCache } from "../../api/mutations/useUpdatePoliceMutation";
import { useGetPolicesQuery } from "../../api/queries/useGetPolicesQuery";
import { DeleteModal } from "../../components/DeleteModal";
import { DetailsList } from "../../components/DetailsList";
import { SelectTags } from "../../components/FormikSelectInput";
import { TransitionedModal } from "../../components/Modal";
import { MutateIcons } from "../../components/MutateIcons";
import { Paginate } from "../../components/Paginate";
import { PoliceForm } from "../../components/PoliceForm";
import { policeSortLabelRecord } from "../../constants";
import { useIsAuthenticated, useIsAuthorized } from "../../hooks";
import { useModal } from "../../hooks/useModal";

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
  const { openModal: openUpdateModal, selectedData: selectedUpdateData, isModalOpen: isUpdateModalOpen, closeModal: closeUpdateModal
  } = useModal<IPolice>();

  const deletePoliceMutation = useDeletePoliceMutation();
  const deletePoliceMutationCache = useDeletePoliceMutationCache();

  const updatePoliceMutation = useUpdatePoliceMutation();
  const updatePoliceMutationCache = useUpdatePoliceMutationCache();

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
      }) => <>
          <TransitionedModal isModalOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
            <PoliceForm<UpdatePolicePayload> showNid={false} showPassword={false} header="Update police" submitButtonText="Update" initialValues={selectedUpdateData!} isMutationLoading={updatePoliceMutation.isLoading} onSubmit={(values) => {
              if (selectedUpdateData) {
                updatePoliceMutation.mutate({
                  address: values.address,
                  designation: values.designation,
                  email: values.email,
                  name: values.name,
                  phone: values.phone,
                  rank: values.rank,
                  endpoint: `police/${selectedUpdateData.nid}`
                }, updatePoliceMutationCache(selectedUpdateData.nid))
              }
            }} validationSchema={updatePolicePayloadValidationSchema} />
          </TransitionedModal>
          <Paginate<GetPolicesPayload, IPoliceSort, IPolicePopulated> filterGroups={[{
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
              <MutateIcons onDeleteIconClick={() => {
                openModal(police)
              }} onUpdateIconClick={() => {
                openUpdateModal(police)
              }} />
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
        </>}
    </DeleteModal>
  </div>
}