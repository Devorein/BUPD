import { Typography, useTheme } from "@mui/material";
import { CreateCasefilePayload, TCasefilePriority, TCasefileStatus } from "@shared";
import { Form, Formik } from "formik";
import { Button, FormikSelectInput, FormikTextInput, Page } from "../components";
import { CASEFILE_PRIORITIES, CASEFILE_STATUSES, CRIME_CATEGORIES, CRIME_WEAPONS } from "../constants";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

const createCasefileInitialPayload: CreateCasefilePayload = {
  categories: [],
  criminals: [],
  location: "",
  priority: "low",
  time: Date.now(),
  victims: [],
  weapons: [],
  status: "open"
};

export default function Case() {
  useIsAuthenticated();
  useIsAuthorized(["police"]);
  const theme = useTheme();
  return <Page>
    <div className="flex items-center justify-center w-full h-full">
      <Formik
        validateOnMount
        initialValues={createCasefileInitialPayload}
        onSubmit={async () => { }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-5 items-center">
            <div className="text-center">
              <Typography variant="h4">Report A Case</Typography>
            </div>
            <div className="flex gap-3 flex-col min-w-[450px] w-1/2 max-h-[500px] overflow-auto pr-5">
              <FormikTextInput
                name="location"
                label="Location of crime"
                placeholder="Dhaka"
              />
              <FormikSelectInput<string[]> renderValue={(values) => {
                return <div className="flex gap-2">{values.map(value => <span key={value} className={`px-2 py-1 rounded-sm text-white font-normal`} style={{ background: theme.palette.primary.main }}>{value}</span>)}</div>
              }} multiple defaultValue={[]} items={CRIME_CATEGORIES} label="Crime category" name="categories" />
              <FormikSelectInput<TCasefilePriority> defaultValue="low" items={CASEFILE_PRIORITIES} label="Priority" name="priority" />
              <FormikSelectInput<TCasefileStatus> defaultValue="open" items={CASEFILE_STATUSES} label="Status" name="status" />
              <FormikSelectInput<string[]> renderValue={(values) => {
                return <div className="flex gap-2 flex-wrap overflow-auto">{values.map(value => <span key={value} className={`px-2 py-1 rounded-sm text-white font-normal`} style={{ background: theme.palette.primary.main }}>{value}</span>)}</div>
              }} multiple defaultValue={[]} items={CRIME_WEAPONS} label="Crime weapons" name="weapons" />
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