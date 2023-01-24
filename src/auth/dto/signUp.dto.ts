import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class DataSignUp {
  @IsNotEmpty({
    message: 'Username is Required',
  })
  username: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Min 6 Characters!',
  })
  @MaxLength(25)
  password: string;
}
