import express from 'express';
import userRouter from './user';
import postRouter from './post';

const router = express.Router();

router.use('/', userRouter);
router.use('/', postRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
