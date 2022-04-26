import { Field, Float, ObjectType } from '@nestjs/graphql';
import { WalletType } from 'src/wallets/graphql/types/wallet.type';

@ObjectType()
export class TransactionType {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  amount: number;

  @Field(() => String)
  description: string;

  @Field(() => WalletType)
  to: WalletType;

  @Field(() => WalletType)
  from: WalletType;
}
