import express from 'express';
import userRouter from './userRouter';
import majorRouter from './majorRouter';
import dashboardRouter from './dashboard';
import postRouter from './postRouter';
import * as authController from '../controller/authController';

const router = express.Router();

router.post('/join', authController.join);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/certify/:certificateToken', authController.certifyUser);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use(authController.protect);

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/dashboard', dashboardRouter);
router.use('/major', majorRouter);

export default router;
