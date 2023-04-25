<img src="logo.svg" height="150px" />

All-in-one solution to create peer-to-peer WebRTC-based mesh networks.

### Features
- 

### Getting Started


```js
import mesh from 'meshy';
```

```js
mesh.setConfiguration({
  servers: {
    websocket: '[your websocket server address]'
  }
});
```

```js
// Example using Socket.io
const { servers } = mesh.getConfiguration();
const socket = io(servers.websocket, {
  autoConnect: false,
  reconnection: false
});

mesh.setSocket(socket);
```

```js
mesh.connect();
```

Sending a `MediaStreamTrack`:
```js
const stream = new MediaStream();
const track = stream.getTracks()[0];

// Send track to entire network
const { trackId, senders } = mesh.addTrack(track, stream);

// Or, send track to individual client
// const { trackId, senders } = mesh.addTrack(track, stream, 'unique-client-id');

// Later... remove track from network
mesh.removeTrack(senders);
```

```js
const DATA_CHANNEL = 'custom-data-channel';

mesh.open(DATA_CHANNEL)
  .then(() => {

    // Sending JSON data via RTCDataChannel
    mesh.send(DATA_CHANNEL, {
      test: 'some cool data in json format'
    });
  });
```

```js
import mesh, { Events } from 'meshy';

mesh.on(Events.PEER_DATA_MESSAGE, (data) => {
  // Process received data object
});

```

```js
mesh.disconnect();
```

### License

meshy (c) by Jaden Dessureault <hello@jaden.io>

meshy is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
