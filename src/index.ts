import express, { Request, Response } from 'express';
import http from 'http';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './router/index';
import errorHandler from './middlewares/errorHandler';

dotenv.config();
const connectDB = async () => {
  const DbConnectionString = process.env.DBUrl || '';
  try {
    const db = await mongoose.connect(DbConnectionString);
    console.log(`Connected to database ${db.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const mongoose = require('mongoose');
const loadExpressApp = async () => {
  await connectDB();
  const app = express();
  const cors = require('cors');

  app.use(cors({ credentials: true, origin: true }));

  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
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
  try {
    const app = await loadExpressApp();
    const server = http.createServer(app);
    const port = process.env.PORT || 8080;

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

createServer()
  .then(() => {
    console.log('Server started!');
  })
  .catch((err) => {
    console.error(err);
  });
