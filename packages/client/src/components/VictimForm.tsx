import { UpdateVictimPayload } from "@bupd/types";
import { VictimRequest } from "@bupd/validation";
import { Typography } from "@mui/material";
import { Form, Formik, FormikConfig } from "formik";
import { Button } from "./Button";
import { FormikTextInput } from "./FormikTextInput";

const updateVictimPayloadValidationSchema = VictimRequest.update("client");

interface VictimFormProps {
  initialValues: UpdateVictimPayload,
  onSubmit: FormikConfig<UpdateVictimPayload>["onSubmit"]
  isMutationLoading: boolean
}

export function VictimForm(props: VictimFormProps) {
  const { isMutationLoading, initialValues, onSubmit } = props;

  return (
    <Formik
      validateOnMount
      validationSchema={updateVictimPayloadValidationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={`p-5 shadow-md rounded-md h-full border-2 w-full`}>
          <div className="my-5 text-center uppercase">
            <Typography variant="h5">Victim</Typography>
          </div>
          <div className="flex flex-col overflow-auto pr-5" style={{
            height: 'calc(100% - 135px)'
          }}>
            <FormikTextInput
              name={`name`}
              label={`Name`}
              placeholder={`John Doe`}
            />
            <FormikTextInput
              name={`address`}
              label={`Address`}
              placeholder={`123 Road`}
            />
            <FormikTextInput
              type="number"
              name={`age`}
              label={`Age`}
              placeholder={'25'}
            />
            <FormikTextInput
              name={`phone_no`}
              label={`Phone number`}
              placeholder={`+8801...`}
            />
            <FormikTextInput
              multiline
              rows={5}
              name={`description`}
              label={`Description`}
              placeholder={`Description ...`}
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