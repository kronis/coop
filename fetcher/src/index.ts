/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchJson, fetchText } from './connection/index.js';
import { MastodonStatus } from './types/MastodonStatus.js';

type InstanceType = {
  configuration: {
    urls: {
      streaming: string;
    };
  };
};

if (!process.env.MASTODON_ACCESS_TOKEN) {
  throw new Error('No access token provided');
}

const FQDN = 'mastodon.social';
const access_token = process.env.MASTODON_ACCESS_TOKEN;

try {
  const instaceData = (await fetchJson(`https://${FQDN}/api/v2/instance`)) as InstanceType;
  console.log(`Streaming service url is: ${instaceData.configuration.urls.streaming}`);
} catch (error) {
  console.error(error);
}

const health = (await fetchText(`https://streaming.${FQDN}/api/v1/streaming/health`)) as string;
console.log(`Health check of the API is: ${health}`);

if (health !== 'OK') {
  console.error('Health check failed');
}

const socket = new WebSocket(`wss://streaming.${FQDN}/api/v1/streaming?access_token=${access_token}&stream=public`);

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('WebSocket connection established');
});
socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});
socket.addEventListener('error', (event) => {
  console.log('Error occurred');
  console.log(event);
});
socket.addEventListener('message', (event) => {
  console.log('Message received');
  const b = JSON.parse(event.data);
  if (b.event === 'update') {
    console.log('Update received');
    const a: MastodonStatus = JSON.parse(b.payload);
    console.log(a);
  }
});
