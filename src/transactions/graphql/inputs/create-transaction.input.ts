import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive({ message: 'Please, enter a positive number' })
  amount: number;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => String)
  @IsString()
  walletId: string;
}
