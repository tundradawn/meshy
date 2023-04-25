import omit from 'lodash/omit';
import without from 'lodash/without';
import merge from 'lodash/merge';
import { v4 as uuidv4 } from 'uuid';

import PeerConnection from './peer-connection';
import { Events, SocketEvents } from './constants';

const DEFAULT_CONFIG = {
  connection: {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  },
  channels: [],
};

class WebRTC {
  Events = Events;
  SocketEvents = SocketEvents;

  constructor() {
    this._config = DEFAULT_CONFIG;
    this._socket = null;
    this._listeners = {};
    this._peers = {};
  }

  setConfiguration(config) {
    this._config = merge({}, DEFAULT_CONFIG, config);
  }

  getConfiguration() {
    return this._config;
  }

  setSocket(socket) {
    this._socket = socket;
    this._setSocketListeners();
  }

  getPeers() {
    return Object.values(this._peers);
  }

  getPeerById(clientId) {
    return this._peers[clientId];
  }

  connect() {
    this._socket.emit(SocketEvents.PEER_CONNECT_OFFER);
  }

  connectPeer(clientId, sendAnswer) {
    const peer = this.getPeerById(clientId);
    const callbacks = {
      onAddTrack: (data) => this.emit(Events.PEER_ADD_TRACK, data),
      onRemoveTrack: (data) => this.emit(Events.PEER_REMOVE_TRACK, data),
      onDataMessage: (data) => this.emit(Events.PEER_DATA_MESSAGE, data)
    };

    if (!peer) {
      this._peers[clientId] = new PeerConnection(clientId, this._socket, this._config.connection, callbacks);

      if (sendAnswer) {
        this._socket.emit(SocketEvents.PEER_CONNECT_ANSWER, { clientId });
      }

      this.emit(Events.PEER_CONNECT, { clientId });

      return this._peers[clientId];
    }
  }

  disconnectPeer(clientId) {
    const peer = this.getPeerById(clientId);

    if (peer) {
      this._peers = omit(this._peers, clientId);

      peer.dispose();
    }
  }

  createDataChannels(clientId) {
    const peer = this.getPeerById(clientId);

    if (peer) {
      peer.createDataChannels(this._config.channels);
    }
  }

  disconnect() {
    this.getPeers().forEach((_peer) => {
      _peer.dispose();
    });

    this._listeners = {};
    this._peers = {};

    this._socket.emit(SocketEvents.PEER_DISCONNECT);
  }

  addTrack(track, stream, clientId) {
    const trackId = uuidv4();

    // Send track to an individual peer
    if (clientId) {
      const peer = this.getPeerById(clientId);
      const sender = peer.addTrack(track, stream, trackId);

      return { trackId, sender };
    }

    // Send track to all peers
    return {
      trackId,
      senders: this.getPeers().map((peer) => (
        peer.addTrack(track, stream, trackId)
      ))
    };
  }

  removeTrack(senders = []) {
    const peers = this.getPeers();

    peers.forEach((peer) => {
      const senderList = peer.getSenders();

      senders.forEach((sender) => {
        if (senderList.includes(sender)) {
          peer.removeTrack(sender);
        }
      });
    });
  }

  send(channel, data, clientId) {
    if (clientId) {
      const peer = this.getPeerById(clientId);

      return peer.send(channel, data);
    }

    return this.getPeers().map((peer) => (
      peer.send(channel, data)
    ));
  }

  to(clientId) {
    return {
      open: (channel) => this.open(channel, clientId),
      send: (channel, data) => this.send(channel, data, clientId),
      addTrack: (track, stream) => this.addTrack(track, stream, clientId)
    };
  }

  on(eventKey, callback) {
    if (!this._listeners[eventKey]) {
      this._listeners[eventKey] = [];
    }

    this._listeners[eventKey].push(callback);
  }

  off(eventKey, callback) {
    this._listeners[eventKey] = without(this._listeners[eventKey], callback);
  }

  open(channel, clientId) {
    if (clientId) {
      const peer = this.getPeerById(clientId);

      return peer.open(channel);
    }

    return Promise.all(
      this.getPeers().map((peer) => peer.open(channel))
    );
  }

  emit(eventKey, data) {
    const listeners = this._listeners[eventKey];

    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  _setSocketListeners() {
    this._socket.on(SocketEvents.PEER_CONNECT_OFFER, (data) => {
      this.connectPeer(data.clientId, true);

      this.createDataChannels(data.clientId);
    });

    this._socket.on(SocketEvents.PEER_CONNECT_ANSWER, (data) => {
      this.connectPeer(data.clientId);
    });

    this._socket.on(SocketEvents.PEER_DISCONNECT, (data) => {
      this.disconnectPeer(data.clientId);
    });
  }
}

export default new WebRTC();
