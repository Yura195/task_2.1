import { Field, Float, ObjectType } from '@nestjs/graphql';
import { TransactionType } from 'src/transactions/graphql/types/transaction.type';
import { UserType } from 'src/users/graphql/types/user.type';

@ObjectType()
export class WalletType {
  @Field(() => String)
  id: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Float)
  incoming: number;

  @Field(() => Float)
  outgoing: number;

  @Field(() => Float)
  actuallyBalance: number;

  @Field(() => Boolean)
  accountClosed: boolean;

  @Field(() => Boolean)
  accountLocked: boolean;

  @Field(() => [TransactionType])
  transactions: TransactionType[];

  @Field(() => UserType)
  user: UserType;
}
