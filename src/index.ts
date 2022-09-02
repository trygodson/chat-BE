import express from 'express';
import socket from './socket';
import { createServer } from 'http';
import App from './services/Express';
import DbConnection from './services/Database';
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import { PORT } from './config';

declare global {
  var onlineUsers: Map<string, any>;
}

// const deployed = 'https://soft-salmiakki-9da3a5.netlify.app/';

dotenv.config();
const app = express();
const server = createServer(app);
const startServer = async () => {
  await DbConnection();
  const io = new Server(server, {
    cors: {
      origin: 'https://soft-salmiakki-9da3a5.netlify.app/',
      credentials: true,
    },
  });

  await App(app);
  server.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
  });

  socket({ io: io });
};

startServer();
