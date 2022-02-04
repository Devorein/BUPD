import cors from 'cors';
import express from 'express';
import { SERVER_PORT } from './config';
import logger from './middlewares/logger';
import { parseQueryTypes } from './middlewares/parseQueryTypes';
import RootRouter from './routes';
import sequelize from "./sequelize";

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

app.listen(SERVER_PORT, async () => {
	console.log(`Server listening on port ${SERVER_PORT}`);
	try {
    // Testing database connection
    await sequelize.authenticate();
		console.log(`Connected to database`);
	} catch (err) {
		console.error(`Error connecting to database\n${err.message}`);
	}
});
