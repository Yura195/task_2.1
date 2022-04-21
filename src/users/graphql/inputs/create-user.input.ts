import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsEmail({}, { message: 'This email is incorrect' })
  email: string;
}
