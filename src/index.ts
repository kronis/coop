import { fetchJson, fetchText } from './connection/index.ts';
import { MastodonStatus } from './types/MastodonStatus.ts';

export * from './connection/index.ts';

type InstanceType = {
  configuration: {
    urls: {
      streaming: string;
    };
  };
};

const FQDN = 'mastodon.social';

try {
  const instaceData = (await fetchJson(`https://${FQDN}/api/v2/instance`)) as InstanceType;
  console.log(instaceData.configuration.urls.streaming);
} catch (error) {
  console.error(error);
}

const health = (await fetchText(`https://streaming.${FQDN}/api/v1/streaming/health`)) as string;
console.log(health);

if (health !== 'OK') {
  console.error('Health check failed');
}

console.log(process.env.MASTODON_ACCESS_TOKEN);
// console.log('Hello, world!');

// const access_token = process.env.MASTODON_ACCESS_TOKEN;

// const socket = new WebSocket(`wss://streaming.mastodon.social/api/v1/streaming?access_token=${access_token}&stream=public`);

// // Connection opened
// socket.addEventListener('open', (event) => {
//   console.log('WebSocket connection established');
//   //   socket.send("Hello Server!");
// });
// socket.addEventListener('close', (event) => {
//   console.log('WebSocket connection closed');
//   //   socket.send("Hello Server!");
// });
// socket.addEventListener('error', (event) => {
//   console.log('Error occurred');
//   console.log(event);
//   //   socket.send("Hello Server!");
// });
// socket.addEventListener('message', (event) => {
//   console.log('Message received');
//   const b = JSON.parse(event.data);
//   if (b.event === 'update') {
//     console.log('Update received');
//     const a: MastodonStatus = JSON.parse(b.payload);
//     console.log(a);
//   }
// });
