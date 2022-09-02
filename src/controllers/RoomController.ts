import express, { Request, Response, NextFunction, request } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '../models/User';
import { CreateRoomInputs } from '../dto/Room.dto';
import { Room } from '../models/Room';

export const CreateRoom = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const { name, users } = <CreateRoomInputs>req.body;
    const currentUser = await User.findById(user._id);
    if (currentUser !== null) {
      let roomusers = await User.find()
        .where('_id')
        .in(users.map(item => item))
        .exec();

      const result = await Room.create({
        name: name,
        users: [user._id, ...roomusers],
        userId: user._id,
      }).then(res => res.populate('users'));

      return res.status(200).json(result);
    }
  }
  return res.status(401).json({ message: 'Something went wrong adding food' });
};

export const GetAllRoom = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  let rooms = await Room.find({
    users: {
      $in: [user._id],
    },
  })
    .populate('users')
    .exec();
  // let rooms = await Room.find().where('userId').equals(user._id).populate('users').exec();

  if (rooms) {
    res.json(rooms);
  } else {
    res.json({ message: 'No rooms Created' });
  }
};
