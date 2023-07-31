import express from 'express';
import dashboardRouter from './dashboard'


const router = express.Router();

router.use('/dashboard', dashboardRouter);

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;
