import express, { Request, Response, NextFunction, request } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '../models/User';
import { CreateRoomInputs } from '../dto/Room.dto';
import { Room } from '../models/Room';
import { CreateMessageInputs, GetMessageInputs } from '../dto/Message.dto';
import { Messages } from '../models/Message';

export const AddMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const userInputs = plainToClass(CreateMessageInputs, req.body);
    const inputErrors = await validate(userInputs, {
      validationError: { target: true },
    });
    const sender = await User.findOne({ _id: user._id });

    if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
    } else {
      const { message, toroom } = userInputs;
      const data = await Messages.create({
        message: { text: message },
        space: [user._id, toroom],
        sender: sender,
      });

      if (data) {
        return res.json({ message: 'sent' });
      } else {
        return res.json({ msg: 'Failed to add message to the database' });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const GetAllMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const userInputs = plainToClass(GetMessageInputs, req.body);
    const inputErrors = await validate(userInputs, {
      validationError: { target: true },
    });

    if (inputErrors) {
      const { toroom } = userInputs;
      const messages = await Messages.find({
        space: {
          $all: [toroom],
        },
      })
        .sort({ updatedAt: -1 })
        .select(['message', 'sender'])
        .populate('sender', 'username');

      // const projectedMessages = messages.map(msg => {
      //   if(messages.)
      //   return {
      //     fromSelf: msg.sender.toString() === from,
      //     message: msg.message.text,
      //   };
      // });
      res.json(messages);
    }
  } catch (error) {
    next(error);
  }
};
