const { v4: uuidv4 } = require('uuid');
const store = require('./store').store;
const sequencer = require('./sequencerWorker');

module.exports = (req, res, next) => {
  // Create a channel for each client
  if (!req.cookies.channel || !store.state.channels[req.cookies.channel]) {
    const id = uuidv4();
    const number = Object.keys(store.state.channels).length;
    const channel = {
      name: number+1,
      channel: number,
      transformations: []
    };

    console.log(`created channel ${channel.name} (${id})`)

    res.cookie('channel', id);
    store.state.channels[id] = channel;

    sequencer.postMessage(store.state);

    // Populate the channel property on req
    req.channel = channel;
  } else {
    // Populate the channel property on req
    req.channel = store.state.channels[req.cookies.channel];
  }

  next();
};
