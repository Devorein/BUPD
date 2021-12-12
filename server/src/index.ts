import express from 'express';
import './config';
import RootRouter from './routes';
import connection from './utils/connect';

const app = express();
app.use(express.json());

app.use('/v1', RootRouter);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
	connection.connect((err) => {
		if (err) {
			console.error(`Error connecting to database\n${err.message}`);
		} else {
			console.log(`Connected to database`);
		}
	});
});
