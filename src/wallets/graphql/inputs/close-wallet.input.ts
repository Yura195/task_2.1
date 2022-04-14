import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class CloseWalletInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => Boolean)
  @IsBoolean()
  flag: boolean;
}
