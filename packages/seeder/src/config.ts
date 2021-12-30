import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.resolve(__dirname, '../../../.env/.env'),
});

dotenv.config({
	path: path.resolve(__dirname, '../../../.env/seeder.env'),
});
