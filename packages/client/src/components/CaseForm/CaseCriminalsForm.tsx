import { CreateCasefilePayload, NewCriminalPayload } from "@bupd/types";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormikContext } from "formik";
import { svgIconSx } from '../../constants';
import { FormikTextInput } from "../FormikTextInput";

export function CaseCriminalsForm() {
  const { setValues, values } = useFormikContext<CreateCasefilePayload>();

  return <div className="flex flex-col">
    <div className="font-bold text-3xl">Criminals</div>
    {(values.criminals).length !== 0 ? <div className="flex gap-1 flex-col">{(values.criminals as NewCriminalPayload[]).map((_, criminalNumber) => <div key={criminalNumber} className="flex flex-col w-full items-end">
      <div className="mt-3 flex justify-between w-full items-center">
        <div className="mt-5 text-xl w-full font-bold">Criminal {criminalNumber + 1}</div>
        <DeleteIcon sx={svgIconSx} className="cursor-pointer" color="error" onClick={() => {
          values.criminals.splice(criminalNumber, 1);
          setValues({
            ...values,
          }, true)
        }} />
      </div>
      <FormikTextInput
        name={`criminals.[${criminalNumber}].name`}
        label={`Criminal name`}
        placeholder={`Criminal ${criminalNumber + 1} name`}
      />
    </div>)}</div> : <div className="text-lg text-gray-600">No Criminals added</div>}
    <div className="flex my-3 gap-3 items-center justify-center flex-col">
      <div className="font-bold text-xl">Add a criminal</div>
      <AddCircleIcon sx={svgIconSx} fontSize='large' className="cursor-pointer" color="secondary" onClick={() => {
        setValues({
          ...values,
          criminals: [...values.criminals, {
            name: "",
            photo: undefined
          }]
        }, true)
      }} />
    </div>
  </div>
}