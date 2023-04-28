require('dotenv').config();
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from 'config';
import redisClient from './utils/connectRedis';
import AppError from './utils/appError';
import { setupLogger } from './logging/morgan';

const app = express();

app.use(express.json({ limit: '10kb' }));

setupLogger(app);

app.use(cookieParser());

app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true,
  }),
);

// ROUTES

app.use('/api/v1/auth');

// HEALTH CHECKER
app.get('/api/healthchecker', async (_, res: Response) => {
  const message = await redisClient.get('try');
  res.status(200).json({
    status: 'Gateway is running',
    message,
  });
});

// GLOBAL ERROR HANDLER

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

const port = config.get<number>('port');
app.listen(port);

console.log(`ApiGateWay started on port: ${port}`);
