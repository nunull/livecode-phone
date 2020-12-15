var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



http.listen(3000);

app.use(express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/node_modules/socket.io/client-dist/"));


io.on('connection', (socket) => {
  console.log('a user connected');
});
