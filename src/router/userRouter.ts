import express from 'express';
import * as userController from '../controller/userController';

const userRouter = express.Router();

userRouter.route('/').get(userController.getAllUsers);

export default userRouter;
