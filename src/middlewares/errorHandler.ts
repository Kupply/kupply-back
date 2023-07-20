import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  const status = err.status || 500;
  if (status === 500) {
    console.error(err.stack || '');
  }
  res.status(status).json({
    data: null,
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};

export default errorHandler;
