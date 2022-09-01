import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserRegisterInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4, 12)
  username: string;

  @IsNotEmpty()
  @Length(6, 14)
  password: string;
}

export class UserLoginInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}

export interface UserPayload {
  _id: string;
  email: string;
}
