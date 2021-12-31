import { BaseSchema } from 'yup';
import validateData from './validateData';

const validateQuery = (validationSchema: BaseSchema) => validateData(validationSchema, true);

export default validateQuery;
