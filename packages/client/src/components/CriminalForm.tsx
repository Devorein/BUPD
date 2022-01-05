import { Typography } from "@mui/material";
import { Form, Formik, FormikConfig } from "formik";
import { BaseSchema } from "yup";
import { Button, FormikTextInput } from ".";

interface CriminalFormProps<Values> {
  initialValues: Values
  validationSchema: BaseSchema
  onSubmit: FormikConfig<Values>["onSubmit"]
  isMutationLoading: boolean
}

export function CriminalForm<Data>(props: CriminalFormProps<Data>) {
  const { initialValues, onSubmit, validationSchema, isMutationLoading } = props;

  return (
    <Formik
      validateOnMount
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={`p-5 shadow-md rounded-md h-full border-2 w-full`}>
          <div className="my-5 text-center uppercase">
            <Typography variant="h5">Criminal</Typography>
          </div>
          <div className="flex flex-col overflow-auto pr-5" style={{
            height: 'calc(100% - 135px)'
          }}>
            <FormikTextInput
              name={`name`}
              label={`Name`}
              placeholder={`John Doe`}
            />
          </div>
          <div className="flex justify-between mt-5">
            <Button
              color="secondary"
              content={"Update"}
              type="submit"
              disabled={!isValid || isSubmitting || isMutationLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}