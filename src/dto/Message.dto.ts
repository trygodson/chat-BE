import { IsNotEmpty } from 'class-validator';

export class CreateMessageInputs {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  toroom: string;
}
export class GetMessageInputs {
  @IsNotEmpty()
  toroom: string;
}
