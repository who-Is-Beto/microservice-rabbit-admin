import { NextFunction, Request, Response } from 'express';
import { LoginUserInput } from '../schemas/user.schema';
import ampqlib from 'amqplib';
import { QueueNames } from '../queues';
import config from 'config';

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rabbitmqConfig = config.get<{
      host: string;
      port: number;
      username: string;
      password: string;
    }>('rabbitmqConfig');
    const queueName = QueueNames.LOGIN;
    const connection = await ampqlib.connect(`amqp://${rabbitmqConfig.host}`);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(req.body)));

    res.status(200).json({
      status: 'success',
      message: 'Login user successfully',
    });
  } catch (err: any) {
    next(err);
  }
};
