import express, { Request, Response } from 'express';
import http from 'http';
import router from './router';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './entity/User';

dotenv.config();

const DB = process.env.DATABASE || '';

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB connected!');
  } catch (err) {
    console.error(err);
  }
};

run();
async function run() {
  try {
    const user = await User.create({
      name: 'Junhyeok',
      age: 22,
      email: 'junhy1607@naver.com',
    });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

const loadExpressApp = async () => {
  await connectDB();
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.enable('trust proxy');

  app.use(router);
  app.use(errorHandler);
  app.all('*', (_, res) => {
    res.status(404).json({
      data: null,
      error: {
        message: 'URL Not Found',
      },
    });
  });
  return app;
};

const createServer = async () => {
  const app = await loadExpressApp();
  const server = http.createServer(app);
  const port = process.env.PORT || 8080;

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

createServer()
  .then(() => {
    console.log('Server started!');
  })
  .catch((err) => {
    console.error(err);
  });
