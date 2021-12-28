import express from 'express';
import AuthRouter from './auth';
import CasefileRouter from './casefile';
import PoliceRouter from './police';
import AccessRouter from './access';
import CriminalRouter from './criminal';

const RootRouter = express.Router();

RootRouter.get('/ping', (_, res) => {
	res.status(200).json('Pong');
});

RootRouter.use('/auth', AuthRouter);
RootRouter.use('/police', PoliceRouter);
RootRouter.use('/casefile', CasefileRouter);
RootRouter.use('/access', AccessRouter);
RootRouter.use('/criminal', CriminalRouter);

export default RootRouter;
