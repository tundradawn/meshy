import merge from 'lodash/merge';

let config = {
  servers: {
    websocket: 'no websocket address provided',
    sdpTrackPrefix: '/meshy-by-jaden-dessureault/'
  },
  channels: []
};

export const setConfiguration = (updated) => {
  config = merge({}, config, updated);
};

export const getConfiguration = () => config;
