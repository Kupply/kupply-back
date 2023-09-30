import express from 'express';
import * as userController from '../controller/userController';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.delete('/:id', userController.deleteUser);
userRouter.post('/reportUser', userController.reportUser);

export default userRouter;
