import express from 'express';
import './config';
import RootRouter from './routes';
import pool from './utils/pool';

export * from './types';

const app = express();
app.use(express.json());

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
