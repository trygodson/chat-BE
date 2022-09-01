import express from 'express';
import { createServer } from 'http';
import App from './services/Express';
import DbConnection from './services/Database';
import dotenv from 'dotenv';
import socket, { Server, Socket } from 'socket.io';
import { PORT } from './config';

declare global {
  var onlineUsers: Map<string, any>;
}

dotenv.config();
const app = express();
const server = createServer(app);
const startServer = async () => {
  await DbConnection();

  await App(app);
};
server.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: 'https://chatter-fe.herokuapp.com',
    credentials: true,
  },
});
const rooms = new Map();

io.on('connection', socket => {
  global.chatSocket = socket;
  socket.on('room', userId => {
    rooms.set(userId, socket.id);
  });

  socket.on('send-msg', data => {
    const sendUserSocket = rooms.get(data.to);
    if (sendUserSocket) {
      socket.broadcast.emit('msg-recieve', data.msg);
      socket.to(sendUserSocket).emit('msg-recieve', data.msg);
    }
  });
});

startServer();
