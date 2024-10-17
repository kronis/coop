import { MastodonStatus } from '../../types/MastodonStatus.js';
import amqp from 'amqplib';

export async function handleWebSocketMessage(event: MessageEvent, channel: amqp.Channel, queueName: string) {
  try {
    const eventData = JSON.parse(event.data);

    if (eventData.event === 'update') {
      const payload: MastodonStatus = JSON.parse(eventData.payload);
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
      console.log('Update received and sent to queue');
    } else {
      console.log('Unhandled event type:', eventData.event);
    }
  } catch (error) {
    console.error('Failed to process WebSocket message:', error);
  }
}
