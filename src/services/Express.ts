import express, { Application } from 'express';
import cors from 'cors';
import { MessageRoute, RoomRoute, UserRoute } from '../routes';

export default async (app: Application) => {
  app.use(
    cors({
      origin: 'https://chat-fe.vercel.app',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'X-Requested-With,content-type',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', UserRoute);
  app.use('/api/room', RoomRoute);
  app.use('/api/message', MessageRoute);

  return app;
};
