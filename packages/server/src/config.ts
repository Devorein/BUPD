import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../../.env/.env')));
Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
});
