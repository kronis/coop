import { WebSocket, WebSocketServer } from 'ws';

const connectedClients: Set<WebSocket> = new Set(); // Set to track all connected clients

export function setupWebSocketHandlers(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    connectedClients.add(ws);

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });
}

export function broadcastToClients(message: string) {
  connectedClients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}
