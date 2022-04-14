import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransactionType } from 'src/transactions/graphql/types/transaction.type';

@ObjectType()
export class WalletType {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Int)
  balance: number;

  @Field(() => Boolean)
  accountClosed: boolean;

  @Field(() => [TransactionType])
  transactions: TransactionType[];
}
