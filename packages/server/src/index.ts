import cors from 'cors';
import express from 'express';
import './config';
import logger from './middlewares/logger';
import { parseQueryTypes } from './middlewares/parseQueryTypes';
import RootRouter from './routes';
import pool from './utils/pool';

const app = express();
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production' ? `https://www.bupd.xyz` : `http://localhost:4000`,
	})
);
app.use(parseQueryTypes());
app.use(express.json());
app.use(logger);
app.use('/v1', RootRouter);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
	try {
		await pool.getConnection();
		console.log(`Connected to database`);
	} catch (err) {
		console.error(`Error connecting to database\n${err.message}`);
	}
});
