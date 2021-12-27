import express from 'express';
import { AuthController, AuthRequest } from '../controllers';
import { isAuthenticated, isAuthorized, validateReq } from '../middlewares';

const AuthRouter = express.Router();

AuthRouter.post('/login', validateReq(AuthRequest.login), AuthController.login);
AuthRouter.post('/register', validateReq(AuthRequest.register), AuthController.register);
AuthRouter.get(
	'/currentUser',
	isAuthenticated,
	isAuthorized(['admin', 'police']),
	AuthController.currentUser
);

export default AuthRouter;
