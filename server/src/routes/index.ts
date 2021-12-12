import express from "express";
import AuthRouter from "./auth";

const RootRouter = express.Router();

RootRouter.get('/ping', (_, res)=> {
  res.status(200).json("Pong")
})

RootRouter.use('/auth', AuthRouter)

export default RootRouter;
