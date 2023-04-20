import { NextFunction, Response, Request } from 'express';
import { AnyZodObject } from 'zod';

export const validate =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: 'error',
          message: error.message,
        });
      }
      next(error);
    }
  };
