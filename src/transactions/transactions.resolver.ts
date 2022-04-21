import { Args, Query, Resolver } from '@nestjs/graphql';
import { TransactionType } from './graphql/types/transaction.type';
import { TransactionsService } from './transactions.service';

@Resolver(() => TransactionType)
export class TransactionsResolver {
  constructor(private readonly _transactionService: TransactionsService) {}

  @Query(() => TransactionType)
  async transaction(
    @Args('id', { type: () => String }) id: string,
  ): Promise<TransactionType> {
    return await this._transactionService.transaction(id);
  }

  @Query(() => [TransactionType])
  async transactions(): Promise<TransactionType[]> {
    return await this._transactionService.transactions();
  }
}
