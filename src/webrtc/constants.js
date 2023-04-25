export const DEFAULT_CONFIG = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};

export const Events = {

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

  // Used to indicate when a peer's media can start playing
  PEER_DISCONNECT: 'webrtc:peer:disconnect'
};

export const SocketEvents = {
  PEER_ICE_CANDIDATE: 'webrtc:socket:peer:ice_candidate',

  // Used for peers to establish a connection to the session
  PEER_CONNECT_OFFER: 'webrtc:socket:peer:connect_offer',
  PEER_CONNECT_ANSWER: 'webrtc:socket:peer:connect_answer',

  // Used for peers to send and receive media (audio/video/screenshare)
  PEER_MEDIA_OFFER: 'webrtc:socket:peer:media_offer',
  PEER_MEDIA_ANSWER: 'webrtc:socket:peer:media_answer',

  // Used when destroying an individual peer
  PEER_DISCONNECT: 'webrtc:socket:peer:disconnect',

  // Used when destroying a session
  SESSION_DISPOSE: 'webrtc:socket:session_dispose'
};

// TODO: Remove?
export const Channels = {
  PING: 'webrtc:channel:ping',
  TRACK: 'webrtc:channel:track'
};
