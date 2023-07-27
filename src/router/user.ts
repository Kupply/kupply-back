import express from 'express';
import * as userController from '../controller/userController';

const userRouter = express.Router();

userRouter.post('/', userController.joinUser);

export default userRouter;
