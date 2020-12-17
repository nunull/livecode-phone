const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const transformations = require('./transformations');

const port = process.env.PORT || 3000;

http.listen(port, () => console.log(`listening on ${port}`));

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public`));
app.use(express.static(`${__dirname}/../common`));
app.use(express.static(`${__dirname}/../node_modules/socket.io/client-dist/`));

const store = {
  pattern: { steps: [5, 0, 3, 2], scaleSteps: 6 },
  channels: [{
    transformations: []
  }]
}

app.get('/api/availableTransformations', (req, res) => {
  res.json(transformations.transformations);
})

app.get('/api/transformations', (req, res) => {
  // TODO channel number
  res.json(store.channels[0].transformations);
})

app.post('/api/transformations', (req, res) => {
  // TODO channel number
  store.channels[0].transformations = req.body.map(t => {
    return t.isTemporary ? transformations.instanciateTransformation(t) : t;
  });
  res.json(store.channels[0].transformations);
})

app.post('/api/transformations/:id', (req, res) => {
  // TODO channel number
  const transformation = store.channels[0].transformations.find(t => t.id === req.params.id);
  if (!transformation) {
    return res.status(404).json({});
  }

  transformation.value = req.body.value;
  res.json({});
})

app.get('/api/pattern', (req, res) => {
  // TODO
  res.json(store.pattern);
})

app.get('/api/channel/:number', (req, res) => {
  // TODO danger
  res.json(store.channels[req.params.number]);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});
