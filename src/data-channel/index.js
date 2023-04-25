class DataChannel {
  constructor(label, connection, callbacks, channel) {
    this._channel = channel || connection.createDataChannel(label);
    this._open = false;

    this._channel.onopen = () => {
      if (callbacks.onopen) {
        callbacks.onopen();
      }

      this._open = true;
    };

    this._channel.onmessage = (event) => {
      callbacks.onmessage(label, JSON.parse(event.data));
    };
  }

  send(data = {}) {
    const transactionId = Math.random() * 1000;
    const transaction = JSON.stringify({
      transactionId,
      ...data
    });

    if (this._open) {
      this._channel.send(transaction);
    }
  }

  close() {
    if (this._open) {
      this._channel.close();
    }
  }
}

export default DataChannel;
