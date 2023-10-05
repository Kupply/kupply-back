import express from 'express';
import * as userController from '../controller/userController';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.delete('/:id', userController.deleteUser);
userRouter.get('/getMe', userController.getMe);
userRouter.post('/updateMe', userController.updateMe);
userRouter.post('/resetPassword', userController.resetPassword);

export default userRouter;
