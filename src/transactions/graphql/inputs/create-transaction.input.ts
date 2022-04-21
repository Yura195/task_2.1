import { Field, Float, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsInt()
  @IsPositive({ message: 'Please, enter a positive number' })
  amount: number;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  walletId: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  fromId: string;
}
