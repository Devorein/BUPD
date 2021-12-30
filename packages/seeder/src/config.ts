import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

let envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../../.env/.env')));
Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
});

envConfig = dotenv.parse(path.resolve(__dirname, '../../../.env/seeder.env'));
Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
});
