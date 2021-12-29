import { Typography, useTheme } from "@mui/material";
import { CreateCasefilePayload, TCasefilePriority, TCasefileStatus } from "@shared";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useCreateCasefileMutation } from "../api";
import { Button, FormikSelectInput, FormikTextInput, Page } from "../components";
import { CaseCriminalsForm } from '../components/CaseForm/CaseCriminalsForm';
import { CaseVictimsForm } from "../components/CaseForm/CaseVictimsForm";
import { CASEFILE_PRIORITIES, CASEFILE_STATUSES, CRIME_CATEGORIES, CRIME_WEAPONS } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createCasefileInitialPayload = (): CreateCasefilePayload => {
  return {
    categories: [],
    criminals: [],
    location: "",
    priority: "low",
    time: Date.now(),
    victims: [],
    weapons: [],
    status: "open"
  }
};

function Tags(props: { values: string[] }) {
  const theme = useTheme();
  return <div className="flex gap-2 flex-wrap overflow-auto">{props.values.map(value => <span key={value} className={`px-2 py-1 rounded-sm text-white font-normal`} style={{ background: theme.palette.primary.main }}>{value}</span>)}</div>
}

export default function Case() {
  useIsAuthenticated();
  useIsAuthorized(["police"]);
  const { enqueueSnackbar } = useSnackbar();
  const createCasefileMutation = useCreateCasefileMutation();
  return <Page>
    <div className="flex items-center justify-center w-full h-full">
      <Formik
        validateOnMount
        initialValues={createCasefileInitialPayload()}
        onSubmit={async (values, { setValues }) => {
          createCasefileMutation.mutate(values, {
            onSuccess() {
              enqueueSnackbar("Successfully created case", {
                variant: "success"
              })
              setValues(createCasefileInitialPayload())
            },
            onError(err) {
              enqueueSnackbar(err, {
                variant: "error"
              })
            }
          })
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-5 items-center">
            <div className="text-center">
              <Typography variant="h4">Report A Case</Typography>
            </div>
            <div className="flex gap-3 flex-col min-w-[450px] w-3/4 max-h-[500px] overflow-auto px-5">
              <FormikTextInput
                name="location"
                label="Location of crime"
                placeholder="Dhaka"
              />
              <FormikSelectInput<string[]> renderValue={(renderValues) => <Tags values={renderValues} />} multiple defaultValue={[]} items={CRIME_CATEGORIES} label="Crime category" name="categories" />
              <FormikSelectInput<TCasefilePriority> defaultValue="low" items={CASEFILE_PRIORITIES} label="Priority" name="priority" />
              <FormikSelectInput<TCasefileStatus> defaultValue="open" items={CASEFILE_STATUSES} label="Status" name="status" />
              <FormikSelectInput<string[]> renderValue={(renderValues) => <Tags values={renderValues} />} multiple defaultValue={[]} items={CRIME_WEAPONS} label="Crime weapons" name="weapons" />
              <div className="border-b-2 border-gray-300 my-3"></div>
              <CaseCriminalsForm />
              <div className="border-b-2 border-gray-300 my-3"></div>
              <CaseVictimsForm />
            </div>
            <div className="flex justify-between my-5">
              <Button
                color="secondary"
                content="Create"
                type="submit"
                disabled={!isValid || isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </Page>
}