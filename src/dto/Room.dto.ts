import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateRoomInputs {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  users: string[];
}
