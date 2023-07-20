import express, { Request, Response } from 'express';
import http from 'http';
import router from './router';
import helmet from 'helmet';

// const connectDB = async () => {
//   try {
//     await dataSource.initialize();
//     console.log('DB connected!');
//   } catch (err) {
//     console.error(err);
//   }
// };
const loadExpressApp = async () => {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.enable('trust proxy');

  app.use(router);
  // app.use(errorHandler);
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
