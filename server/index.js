const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const http = require('http').createServer(app);


const api = require('./api');
const channelMiddleware = require('./channelMiddleware');
const sequencer = require('./sequencerWorker');

const port = process.env.PORT || 3000

http.listen(port, () => console.log(`listening on ${port}`));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/../public`));
app.use(express.static(`${__dirname}/../common`));

app.use(channelMiddleware);
app.use('/api', api);
