/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createWebSocketWithRetry, fetchJson, fetchText, handleWebSocketMessage } from './connection/index.js';
import { InstanceType } from './types/InstanceType.js';
import amqp from 'amqplib';

// Ensure MASTODON_ACCESS_TOKEN is set
const FQDN = 'mastodon.social';
const accessToken = process.env.MASTODON_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('MASTODON_ACCESS_TOKEN is required.');
}

// Fetch Mastodon instance streaming URL
let streamingUrl: string | undefined;
try {
  const instanceData = (await fetchJson(`https://${FQDN}/api/v2/instance`)) as InstanceType;
  streamingUrl = instanceData.configuration.urls.streaming;
  console.log(`Streaming service URL: ${streamingUrl}`);
} catch (error) {
  console.error('Failed to fetch Mastodon instance data:', error);
  process.exit(1); // Exit process if the instance data fetch fails
}

// Check API health status
try {
  const health = await fetchText(`https://streaming.${FQDN}/api/v1/streaming/health`);
  console.log(`Health check result: ${health}`);

  if (health !== 'OK') {
    throw new Error('Health check failed');
  }
} catch (error) {
  console.error('Failed to perform health check:', error);
  process.exit(1); // Exit if health check fails
}

// Set up WebSocket
if (!streamingUrl) {
  throw new Error('Streaming URL is not available');
}

// RabbitMQ setup
const QUEUE_NAME = 'mastodon-posts';

const connectToRabbitMQ = async (retryCount = 0, maxRetries = 5): Promise<amqp.Channel | null> => {
  const retryDelay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff with max 30 seconds
  try {
    const connection = await amqp.connect('amqp://rabbit-mq');
    console.log('AMQP connection established');
    channel = await connection.createChannel();
    console.log('AMQP channel created');
    await channel.assertQueue(QUEUE_NAME);
    console.log('Queue asserted');
    return channel;
  } catch (error) {
    if (retryCount < maxRetries) {
      console.error(
        `Failed to establish AMQP connection or channel (retrying in ${retryDelay / 1000} seconds):`,
        error,
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return connectToRabbitMQ(retryCount + 1, maxRetries);
    } else {
      console.error('Max retries reached. Could not connect to RabbitMQ:', error);
      process.exit(1); // Exit if the connection fails after retries
    }
  }
  return null;
};

let channel: amqp.Channel | null = null;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  channel = await connectToRabbitMQ(); // Connect with retry
  if (!channel) {
    console.error('Failed to connect to RabbitMQ.');
    process.exit(1);
  }

  try {
    const instanceData = await fetchJson(`https://${FQDN}/api/v2/instance`);
    const streamingUrl = instanceData.configuration.urls.streaming;
    console.log(`Streaming service URL: ${streamingUrl}`);

    const socketUrl = `${streamingUrl}/api/v1/streaming?access_token=${accessToken}&stream=public`;
    createWebSocketWithRetry(socketUrl, 5, (event) => handleWebSocketMessage(event, channel!, QUEUE_NAME));
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
