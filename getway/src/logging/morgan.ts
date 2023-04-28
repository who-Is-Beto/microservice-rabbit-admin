import { Application } from 'express';
import morgan from 'morgan';

export const setupLogger = (app: Application) => {
  app.use(morgan('combined'));
};
