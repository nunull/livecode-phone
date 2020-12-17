const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');

const { Worker } = require('worker_threads');
const sequencer = new Worker(`${__dirname}/sequencer.js`);
sequencer.on('message', (message) => {
  console.log(message);
});
sequencer.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
sequencer.on('exit', (code) => {
  if (code !== 0) {
    console.error(`sequencer stopped with exit code ${code}`);
    process.exit(1);
  }
});

const transformations = require('./transformations');

const port = process.env.PORT || 3000;

const store = {
  pattern: { steps: [5, 0, 3, 2], scaleSteps: 6, scale: [], octave: 3 },
  channels: {}
}

http.listen(port, () => console.log(`listening on ${port}`));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/../public`));
app.use(express.static(`${__dirname}/../common`));
app.use(express.static(`${__dirname}/../node_modules/socket.io/client-dist/`));

app.use((req, res, next) => {
  // Create a channel for each client
  if (!req.cookies.channel || !store.channels[req.cookies.channel]) {
    const id = uuidv4();
    const number = Object.keys(store.channels).length;
    const channel = {
      name: number+1,
      channel: number,
      transformations: []
    };

    res.cookie('channel', id);
    store.channels[id] = channel;

    sequencer.postMessage(store);

    // Populate the channel property on req
    req.channel = channel;
  } else {
    // Populate the channel property on req
    req.channel = store.channels[req.cookies.channel];
  }

  next();
});

app.get('/api/init', (req, res) => {
  res.json({
    channel: { name: req.channel.name },
    transformations: req.channel.transformations,
    availableTransformations: transformations.transformations,
    pattern: store.pattern
  });
});

app.post('/api/transformations', (req, res) => {
  req.channel.transformations = req.body.map(t => {
    return t.isTemporary ? transformations.instanciateTransformation(t) : t;
  });

  sequencer.postMessage(store);
  res.json(req.channel.transformations);
});

app.post('/api/transformations/:id', (req, res) => {
  const transformation = req.channel.transformations.find(t => t.id === req.params.id);
  if (!transformation) {
    return res.status(404).json({});
  }

  transformation.value = req.body.value;

  sequencer.postMessage(store);
  res.json({});
});

io.on('connection', (socket) => {
  console.log('web socket connection');
});
