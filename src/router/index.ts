import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import majorRouter from './majorRouter';
import dashboardRouter from './dashboard';
import postRouter from './postRouter';
import messageRouter from './messageRouter';
import pastDataRouter from './pastDataRouter';
import landingPageRouter from './landingPageRouter'
import * as authController from '../controller/authController';

const router = express.Router();

router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/landing', landingPageRouter);

// FIXME: 나중에 적절한 위치로 수정
router.use(authController.protect);

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/dashboard', dashboardRouter);
router.use('/message', messageRouter);
router.use('/pastData', pastDataRouter);
router.use('/major', majorRouter);

export default router;
