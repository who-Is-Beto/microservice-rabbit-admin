import amqplib, { Channel, Connection } from 'amqplib';
import express, { Request, Response } from 'express';
import config from 'config';

const app = express();

app.use(express.json());

let channel: Channel;
let connection: Connection;
const port = config.get<number>('port');

// connect to rabbitmq
async function connect(): Promise<void> {
  try {
    const amqpServer = 'amqp://localhost:5672';
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    await channel.assertQueue('ORDER');
  } catch (error) {
    console.error(error);
  }
}

app.post('/order', (req: Request, res: Response): void => {
  const data = req.body;
  channel.sendToQueue(
    'ORDER',
    Buffer.from(
      JSON.stringify({
        ...data,
        status: 'PENDING',
        date: new Date(),
      }),
    ),
  );
  res.send('Order sent to queue');
});

app.get('*', (req: Request, res: Response): void => {
  res.status(404).send('Not found');
});

app.listen(port, async (): Promise<void> => {
  console.log(`Order service started on port: ${port}`);
  await connect();
});
