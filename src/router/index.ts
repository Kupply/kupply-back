import express from 'express';
import postRouter from './post';
import userRouter from './user';

const router = express.Router();

router.use('/user', userRouter);
router.use('/post', postRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
