import express from 'express';
import * as userController from '../controller/userController';
import { upload } from '../utils/s3';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.delete('/:id', userController.deleteUser);
userRouter.get('/getMe', userController.getMe);
userRouter.post('/updateMe', userController.updateMe);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter
  .route('/profile')
  .get(userController.getProfileFromS3)
  .post(upload.single('image'), userController.uploadProfileToS3);
userRouter.post(
  '/resume',
  upload.single('document'),
  userController.uploadResumeToS3,
);

export default userRouter;
