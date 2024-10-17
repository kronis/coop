import amqp from 'amqplib';
import { broadcastToClients } from './websocket.js';

const QUEUE_NAME = 'mastodon-posts';

const connectToRabbitMQ = async (retryCount = 0, maxRetries = 5): Promise<{ channel: amqp.Channel; connection: amqp.Connection } | null> => {
  const retryDelay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff with max 30 seconds
  try {
    const connection = await amqp.connect('amqp://rabbit-mq');
    console.log('AMQP connection established');
    const channel = await connection.createChannel();
    console.log('AMQP channel created');
    await channel.assertQueue(QUEUE_NAME);
    console.log('Queue asserted');
    return {channel, connection}
  } catch (error) {
    if (retryCount < maxRetries) {
      console.error(`Failed to establish AMQP connection or channel (retrying in ${retryDelay / 1000} seconds):`, error);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return connectToRabbitMQ(retryCount + 1, maxRetries);
    } else {
      console.error('Max retries reached. Could not connect to RabbitMQ:', error);
      process.exit(1); // Exit if the connection fails after retries
    }
  }
  return null;
};

export async function setupRabbitMQ() {
  const rabbit = await connectToRabbitMQ();
  if (!rabbit) {
    console.error('Failed to connect to RabbitMQ.');
    process.exit(1);
  }
  const {channel, connection} = rabbit;
  

  channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg) {
        try {
          const post = msg.content.toString();
          console.log(`Received message from queue: ${post}`);

          broadcastToClients(post); // Send message to all WebSocket clients

          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message from queue:', error);
        }
      }
    },
    { noAck: false },
  );

  return { connection, channel };
}
