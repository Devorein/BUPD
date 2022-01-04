import { POLICE_RANKS } from "@bupd/constants";
import { IPolice } from "@bupd/types";
import { Typography } from "@mui/material";
import { Form, Formik, FormikConfig } from "formik";
import { AnySchema } from "yup";
import { Button } from "./Button";
import { FormikSelectInput } from "./FormikSelectInput";
import { FormikTextInput } from "./FormikTextInput";

interface PoliceFormProps<PoliceData> {
  initialValues: PoliceData,
  validationSchema: AnySchema
  isMutationLoading: boolean
  onSubmit: FormikConfig<PoliceData>["onSubmit"]
  header: string
  submitButtonText: string
  className?: string
  showPassword: boolean
  showNid: boolean
}

export function PoliceForm<PoliceData = IPolice>(props: PoliceFormProps<PoliceData>) {
  const { showNid, showPassword, header, submitButtonText, initialValues, className, onSubmit, validationSchema, isMutationLoading } = props;

  return (
    <Formik
      validateOnMount
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={`p-5 shadow-md rounded-md h-full border-2 w-full ${className ?? ""}`}>
          <div className="underline my-5 text-center uppercase">
            <Typography variant="h4">{header}</Typography>
          </div>
          <div className="flex flex-col overflow-auto pr-5" style={{
            height: 'calc(100% - 135px)'
          }}>
            <FormikTextInput
              disabled={isMutationLoading}
              name="name"
              label="Full name"
              placeholder="John Doe"
            />
            <FormikTextInput
              disabled={isMutationLoading}
              name="email"
              label="Email address"
              placeholder="johndoe@gmail.com"
            />
            {showPassword && <FormikTextInput
              disabled={isMutationLoading}
              name="password"
              label="Password"
              placeholder="*****"
              type="password"
            />}
            <FormikSelectInput<string> defaultValue={POLICE_RANKS[0]} items={POLICE_RANKS} label="Rank" name="rank" />
            <FormikTextInput
              disabled={isMutationLoading}
              name="phone"
              label="Phone"
              placeholder="+880..."
            />
            <FormikTextInput
              disabled={isMutationLoading}
              name="designation"
              label="Designation"
              placeholder="Police Station"
            />
            {showNid && <FormikTextInput
              disabled={isMutationLoading}
              name="nid"
              label="NID"
              placeholder="123456"
              type="number"
            />}
            <FormikTextInput
              disabled={isMutationLoading}
              name="address"
              label="Address"
              placeholder="Road 123"
              multiline
              rows={2}
            />
          </div>
          <div className="flex justify-between mt-5">
            <Button
              color="secondary"
              content={submitButtonText}
              type="submit"
              disabled={!isValid || isSubmitting || isMutationLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}