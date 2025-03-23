import { IsNotEmpty } from "class-validator";

export class VerifyAccountAuthDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  activationCode: string;
}
