const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let videoQueue = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/queue', (req, res) => {
  res.render('queue');
});

app.get('/player', (req, res) => {
  res.render('player');
});

io.on('connection', (socket) => {
  socket.emit('queueUpdated', videoQueue);

  socket.on('addVideo', (url) => {
    videoQueue.push(url);
    io.emit('queueUpdated', videoQueue);
  });

  socket.on('videoPlayed', () => {
    videoQueue.shift();
    io.emit('queueUpdated', videoQueue);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:3000');
});
