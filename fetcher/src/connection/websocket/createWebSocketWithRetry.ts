import { wait } from '../utils.js';

// WebSocket with retry logic
export function createWebSocketWithRetry(
  url: string,
  maxRetries = 5,
  onMessageCallback: (event: MessageEvent) => void,
) {
  let retries = 0;
  let socket: WebSocket | null = null;

  const connect = () => {
    socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      retries = 0; // Reset retries on successful connection
    });

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event.reason || 'No reason provided');
      retryConnection();
    });

    socket.addEventListener('error', (event) => {
      console.error('WebSocket error occurred:', event);
      retryConnection();
    });

    socket.addEventListener('message', onMessageCallback);
  };

  const retryConnection = () => {
    if (retries < maxRetries) {
      const delay = Math.min(1000 * 2 ** retries, 30000); // Exponential backoff with max 30 seconds
      console.log(`WebSocket retrying in ${delay}ms...`);

      retries += 1;
      wait(delay).then(connect);
    } else {
      console.error('Max retries reached. Could not reconnect to WebSocket.');
    }
  };

  connect(); // Initial connection

  return socket;
}
