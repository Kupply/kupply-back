import express from 'express';
import userRouter from './userRouter';
import majorRouter from './majorRouter';
import * as userController from '../controller/userController';
import dashboardRouter from './dashboard';
import postRouter from './postRouter';

const router = express.Router();

router.post('/join', userController.join);
router.post('/login', userController.login);

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/dashboard', dashboardRouter);
router.use('/major', majorRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
