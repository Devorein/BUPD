import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateCasefilePayload } from "@shared";
import { useFormikContext } from "formik";
import { svgIconSx } from '../../constants';
import { FormikTextInput } from "../FormikTextInput";

export function CaseVictimsForm() {
  const { setValues, values } = useFormikContext<CreateCasefilePayload>();

  return <div className="flex flex-col">
    <div className="font-bold text-3xl">Victims</div>
    {(values.victims).length !== 0 ? <div className="flex gap-1 flex-col">{(values.victims).map((_, victimNumber) => <div key={victimNumber} className="flex flex-col w-full items-end">
      <div className="mt-5 text-xl w-full font-bold">Victim {victimNumber + 1}</div>
      <FormikTextInput
        rightIcon={<DeleteIcon sx={svgIconSx} className="cursor-pointer" color="error" onClick={() => {
          values.victims.splice(victimNumber, 1);
          setValues({
            ...values,
          }, true)
        }} />}
        name={`victims.[${victimNumber}].name`}
        label={`Victim Name`}
        placeholder={`Victim ${victimNumber + 1} name`}
      />
      <FormikTextInput
        name={`victims.[${victimNumber}].address`}
        label={`Victim Address`}
        placeholder={`Victim ${victimNumber + 1} address`}
      />
      <FormikTextInput
        type="number"
        name={`victims.[${victimNumber}].age`}
        label={`Victim age`}
        placeholder={'25'}
      />
      <FormikTextInput
        name={`victims.[${victimNumber}].phone_no`}
        label={`Victim Phone number`}
        placeholder={`+8801...`}
      />
      <FormikTextInput
        multiline
        rows={3}
        name={`victims.[${victimNumber}].description`}
        label={`Victim Description`}
        placeholder={`Victim ${victimNumber + 1} description`}
      />
    </div>)}</div> : <div className="text-lg text-gray-600">No Victims added</div>}
    <div className="flex my-3 gap-3 items-center justify-center flex-col">
      <div className="font-bold text-xl">Add a victim</div>
      <AddCircleIcon sx={svgIconSx} fontSize='large' className="cursor-pointer" color="secondary" onClick={() => {
        setValues({
          ...values,
          victims: [...values.victims, {
            name: "",
            address: "",
            age: 0,
            description: "",
            phone_no: ""
          }]
        }, true)
      }} />
    </div>
  </div>
}