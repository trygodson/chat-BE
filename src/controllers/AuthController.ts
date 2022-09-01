import express, { Request, Response, NextFunction, request } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserLoginInput, UserRegisterInputs } from '../dto/Auth.dto';
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utils';
import { User } from '../models/User';

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginInputs = plainToClass(UserLoginInput, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  } else {
    const { email, password } = loginInputs;
    const user = await User.findOne({ email: email });
    if (user != null) {
      const validation = await ValidatePassword(password, user.password, user.salt);

      if (validation) {
        const signature = await GenerateSignature({
          _id: user._id,
          email: user.email,
        });

        return res.status(201).json({
          token: signature,
          email: user.email,
          username: user.username,
          permission: user.permission,
        });
      }
    }
    res.status(400).json({ message: 'Error Login In' });
  }
};

export const UserRegister = async (req: Request, res: Response, next: NextFunction) => {
  const userInputs = plainToClass(UserRegisterInputs, req.body);
  const inputErrors = await validate(userInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, password, username } = userInputs;
    const salt = await GenerateSalt();
    const userpassword = await GeneratePassword(password, salt);

    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });
    if (existingUser !== null || existingEmail !== null) {
      res.status(400).json({ message: 'An existing user with provided details' });
    } else {
      const result = await User.create({
        username: username,
        email: email,
        salt: salt,
        password: userpassword,
        permission: ['Admin'],
      });

      if (result) {
        const signature = await GenerateSignature({
          _id: result._id,
          email: result.email,
        });

        return res.status(201).json({
          token: signature,
          email: result.email,
          username: result.username,
          permission: result.permission,
        });
      } else {
        res.status(400).json({ message: 'Error with signup' });
      }
    }
  }
};

export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const users = await User.find({ _id: { $ne: user._id } }).select(['username']);
    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    next(error);
  }
};
