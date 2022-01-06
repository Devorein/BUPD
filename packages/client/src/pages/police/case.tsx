import { CreateCasefilePayload } from "@bupd/types";
import { CasefilePayload } from "@bupd/validation";
import { useSnackbar } from "notistack";
import { useCreateCasefileMutation } from "../../api";
import { CasefileForm } from "../../components/CasefileForm";
import { useIsAuthenticated, useIsAuthorized } from "../../hooks";

const createCasefileInitialPayload = (): CreateCasefilePayload => ({
  categories: [],
  criminals: [],
  location: "",
  priority: 2,
  time: Date.now(),
  victims: [],
  weapons: [],
  status: "open"
});

const createCasePayloadValidationSchema = CasefilePayload.create("client");

export default function Case() {
  useIsAuthenticated();
  useIsAuthorized(["police"]);
  const { enqueueSnackbar } = useSnackbar();
  const createCasefileMutation = useCreateCasefileMutation();

  return <CasefileForm<CreateCasefilePayload> header={"Report a case"} isMutationLoading={createCasefileMutation.isLoading} showExtra submitButtonText="Create" initialValues={createCasefileInitialPayload()} onSubmit={async (values, { setValues }) => {
    createCasefileMutation.mutate(values, {
      onSuccess() {
        enqueueSnackbar("Successfully created case", {
          variant: "success"
        })
        setValues(createCasefileInitialPayload())
      },
      onError(err: any) {
        enqueueSnackbar(err.message, {
          variant: "error"
        })
      }
    })
  }} validationSchema={createCasePayloadValidationSchema} />
}