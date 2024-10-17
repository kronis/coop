import { useState, useEffect, useRef } from 'react';
import './App.css';
import { MastodonStatus } from './MastodonStatus';

function App() {
  const [messages, setMessages] = useState<MastodonStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      const socket = new WebSocket('ws://localhost:3000');

      socket.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as MastodonStatus;
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, data];
          // Ensure only the last 3 messages are kept
          return updatedMessages.slice(-3);
        });
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      socketRef.current = socket;
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <div className="websocket-controls">
        <button onClick={connectWebSocket} disabled={isConnected}>
          Connect
        </button>
        <button onClick={disconnectWebSocket} disabled={!isConnected}>
          Disconnect
        </button>
      </div>

      <div className="websocket-data">
        <h2>Last 3 WebSocket Messages:</h2>
        {messages.length > 0 ? (
          <ul>
            {messages.map((message, index) => (
              <li key={index}>
                <p><a href={message.uri}>{message.account.username}</a></p>
                <div className="content" dangerouslySetInnerHTML={{__html: message.content}}></div>
                {/* <p>{new Date(message.timestamp).toLocaleString()}</p> */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data received yet</p>
        )}
      </div>
    </>
  );
}

export default App;
