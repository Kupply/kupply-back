import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import majorRouter from './majorRouter';
import dashboardRouter from './dashboard';
import postRouter from './postRouter';
import messageRouter from './messageRouter';
import pastDataRouter from './pastDataRouter';
import landingPageRouter from './landingPageRouter';
import adminRouter from './adminRouter';
import * as authController from '../controller/authController';
import * as applicationController from '../controller/applicationController';

const router = express.Router();

router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use(authController.protect);

router.use('/admin', adminRouter);
router.use('/landing', landingPageRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/dashboard', dashboardRouter);
router.use('/message', messageRouter);
router.use('/pastData', pastDataRouter);
router.use('/major', majorRouter);

export default router;
