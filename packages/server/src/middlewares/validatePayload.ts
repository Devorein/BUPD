import { BaseSchema } from 'yup';
import validateData from './validateData';

const validatePayload = (resourceSchema: BaseSchema) => validateData(resourceSchema);

export default validatePayload;
