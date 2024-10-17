import { Server } from 'http';
import amqp from 'amqplib';

export function setupGracefulShutdown(server: Server, channel: amqp.Channel, connection: amqp.Connection) {
  process.on('SIGINT', async () => {
    console.log('Shutting down...');

    await channel.close();
    await connection.close();

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}
