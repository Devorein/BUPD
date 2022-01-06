import { CASEFILE_PRIORITIES, CASEFILE_STATUSES, CRIME_CATEGORIES, CRIME_WEAPONS, PRIORITY_RECORD } from "@bupd/constants";
import { TCasefilePriority, TCasefileStatus } from "@bupd/types";
import { Typography } from "@mui/material";
import { Form, Formik, FormikConfig } from "formik";
import { BaseSchema } from "yup";
import { Button } from "./Button";
import { CaseCriminalsForm } from "./CaseForm/CaseCriminalsForm";
import { CaseVictimsForm } from "./CaseForm/CaseVictimsForm";
import { FormikSelectInput, SelectTags } from "./FormikSelectInput";
import { FormikTextInput } from "./FormikTextInput";

interface CasefileFormProps<Values> {
  initialValues: Values
  validationSchema: BaseSchema
  onSubmit: FormikConfig<Values>["onSubmit"]
  showExtra?: boolean
  isMutationLoading: boolean
  submitButtonText: string
  className?: string
  header: string
}

export function CasefileForm<Values>(props: CasefileFormProps<Values>) {
  const { initialValues, onSubmit, validationSchema } = props;
  return <div className="flex items-center justify-center w-full h-full">
    <Formik
      validateOnMount
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col gap-5 items-center p-5 shadow-md rounded-md h-full border-2 w-full max-w-[450px]">
          <div className="mt-3 text-center uppercase">
            <Typography variant="h5">Report A Case</Typography>
          </div>
          <div className="flex flex-col overflow-auto pr-5 w-full gap-2" style={{
            height: 'calc(100% - 135px)'
          }}>
            <FormikTextInput
              name="location"
              label="Location of crime"
              placeholder="Dhaka"
            />
            <FormikSelectInput<string[]> multiple items={CRIME_CATEGORIES} label="Crime categories" name="categories" />
            <FormikSelectInput<TCasefilePriority> defaultValue={2} items={CASEFILE_PRIORITIES} menuItemRender={(value) => PRIORITY_RECORD[value]} label="Priority" name="priority" renderValue={(value) => <SelectTags values={[PRIORITY_RECORD[value]]} />} />
            <FormikSelectInput<TCasefileStatus> defaultValue="open" items={CASEFILE_STATUSES} label="Status" name="status" />
            <FormikSelectInput<string[]> multiple defaultValue={[]} items={CRIME_WEAPONS} label="Crime weapons" name="weapons" />
            <div className="border-b-2 border-gray-300 my-3"></div>
            <CaseCriminalsForm />
            <div className="border-b-2 border-gray-300 my-3"></div>
            <CaseVictimsForm />
          </div>
          <div className="flex justify-between mr-7">
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
}