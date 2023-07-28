import express from 'express';
import userRouter from './userRouter';
import majorRouter from './majorRouter';
import * as userController from '../controller/userController';

const router = express.Router();

router.post('/join', userController.join);
router.post('/login', userController.login);

router.use('/user', userRouter);
router.use('/major', majorRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
