import express from 'express';
import AccessRouter from './access';
import AuthRouter from './auth';
import CasefileRouter from './casefile';
import CriminalRouter from './criminal';
import PoliceRouter from './police';
import VictimRouter from './victim';

const RootRouter = express.Router();

RootRouter.get('/ping', (_, res) => {
	res.status(200).json('Pong');
});

RootRouter.use('/auth', AuthRouter);
RootRouter.use('/police', PoliceRouter);
RootRouter.use('/casefile', CasefileRouter);
RootRouter.use('/access', AccessRouter);
RootRouter.use('/criminal', CriminalRouter);
RootRouter.use('/victim', VictimRouter);

export default RootRouter;
