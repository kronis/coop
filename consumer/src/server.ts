/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express from 'express';
import { WebSocketServer } from 'ws';
import { setupWebSocketHandlers, broadcastToClients } from './websocket.js';
import { setupRabbitMQ } from './rabbitmq.js';
import { setupGracefulShutdown } from './shutdown.js';

export async function startServer() {
  try {
    const app = express();
    const server = app.listen(3000, () => console.log('Server running on port 3000'));

    const wss = new WebSocketServer({ server });
    setupWebSocketHandlers(wss);

    // Setup RabbitMQ connection and channel
    const { connection, channel } = await setupRabbitMQ();

    // Ensure RabbitMQ messages are broadcast to WebSocket clients
    channel.consume('mastodon-posts', (msg) => {
      if (msg) {
        const post = msg.content.toString();
        console.log(`Broadcasting message to clients: ${post}`);

        broadcastToClients(post); // Send the message to WebSocket clients

        channel.ack(msg); // Acknowledge the message
      }
    });

    // Setup graceful shutdown to close the server and RabbitMQ connection cleanly
    setupGracefulShutdown(server, channel, connection);

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
