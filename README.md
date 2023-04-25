![meshy logo](logo.png)

All-in-one solution to create full-mesh topology in the browser via WebRTC and WebSockets.

### Features
- Peer-to-peer and full-mesh topology support.
- WebSockets are used for all signalling events, and are handled out of the box.
- Simple API to send audio tracks and JSON-format data channel messages.
- Per-offer customization, which means information can easily be sent to an individual peer, or the entire network.
- Automatic handling of trickle ICE candidates.
- Offer-Answer persistant track identification via custom SDP communication. 

### Getting Started


```js
import mesh, { Events } from 'meshy';
```

Set configuration. The `connection` node equates to [`RTCPeerConnection`](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection):
```js
mesh.setConfiguration({
  connection: {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  },
  channels: ['chat-message', 'track-edit'],
});
```

Setup the `WebSocket` signaling server:
```js
const socket = new WebSocket(/* Your WebSocket server address */);

mesh.setSocket(socket);
```

Connect the mesh network:
```js
mesh.connect();
```

Sending audio with `MediaStreamTrack`:
```js
const stream = new MediaStream();
const track = stream.getTracks()[0];

// Send track to entire network
const { trackId, senders } = mesh.addTrack(track, stream);

// Later... remove track from network using generated senders
mesh.removeTrack(senders);
```

Sending data with `RTCDataChannel`:
```js
mesh.open('chat-message')
  .then(() => {

    // Once the data-channel is open, data can be sent freely
    mesh.send('chat-message', {
      message: 'hello world'
    });
  });
```

Receiving data with `RTCDataChannel`:
```js
mesh.on(Events.PEER_DATA_MESSAGE, (data) => {
  
  // Process received 'chat-message' data object
  if (data.channel === 'chat-message') {
    console.log(data.message);
  }
});
```

Disconnect the mesh network:
```js
mesh.disconnect();
```

### Documentation

#### API

```js
setConfiguration(config)
getConfiguration(): Object
setSocket(socket)
getPeers(): [RTCPeerConnection]
getPeerById(clientId): RTCPeerConnection
connect()
disconnect()
on(eventKey, callback)
off(eventKey, callback)

// Mesh-wide functionality
addTrack(track, stream): { trackId, senders }
removeTrack(senders)
send(channel, data)
open(channel): [Promise]

// Individual peer functionality
to(clientId).addTrack(track, stream): { trackId, sender }
to(clientId).removeTrack(senders)
to(clientId).send(channel, data)
to(clientId).open(channel): Promise
```

#### Constants
```js
Events = {

  // Used to create the initial rtc mesh connection
  MESH_CREATE_OFFER: 'webrtc:mesh_create:offer',
  MESH_CREATE_ANSWER: 'webrtc:mesh_create:answer',

  // Used to indicate when a mesh network is established (at least 2 peers)
  MESH_READY: 'webrtc:mesh:ready',

  // Used to indicate when a peer has connected to the network
  PEER_CONNECT: 'webrtc:peer:connect',

  // Used to indicate when a peer's media can start playing
  PEER_ADD_TRACK: 'webrtc:peer:add_track',
  PEER_REMOVE_TRACK: 'webrtc:peer:remove_track',

  // Used to indicate when a peer receives or sends a data channel message
  PEER_DATA_MESSAGE: 'webrtc:peer:data_message',

  // Used to indicate when a peer is disconnected
  PEER_DISCONNECT: 'webrtc:peer:disconnect'
}
```

```js
SocketEvents = {

  // Used when ice candidate is initialized
  PEER_ICE_CANDIDATE: 'webrtc:socket:peer:ice_candidate',

  // Used for peers to establish a connection to the session
  PEER_CONNECT_OFFER: 'webrtc:socket:peer:connect_offer',
  PEER_CONNECT_ANSWER: 'webrtc:socket:peer:connect_answer',

  // Used for peers to send and receive media (audio/video/screenshare)
  PEER_MEDIA_OFFER: 'webrtc:socket:peer:media_offer',
  PEER_MEDIA_ANSWER: 'webrtc:socket:peer:media_answer',

  // Used when destroying an individual peer
  PEER_DISCONNECT: 'webrtc:socket:peer:disconnect'
}
```

### License

meshy (c) by Jaden Dessureault

meshy is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.
