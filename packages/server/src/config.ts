import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../../.env/.env')));
Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
});

export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const SERVER_PORT = process.env.SERVER_PORT!;
export const PASSWORD_SALT = process.env.PASSWORD_SALT!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const DATABASE_NAME = process.env.DATABASE_NAME!;
export const DATABASE_USER = process.env.DATABASE_USER!;