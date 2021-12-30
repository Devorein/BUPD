import './config';
import createDb from './createDb';

const [databaseName] = process.argv.slice(2);

createDb(databaseName);
