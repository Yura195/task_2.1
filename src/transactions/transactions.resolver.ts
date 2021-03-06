import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TransactionType } from './graphql/types/transaction.type';
import { TransactionsService } from './transactions.service';

@Resolver(() => TransactionType)
export class TransactionsResolver {
  private _logger = new Logger(TransactionsResolver.name);

  constructor(private readonly _transactionService: TransactionsService) {}

  @Query(() => TransactionType)
  async transaction(
    @Args('id', { type: () => String }) id: string,
  ): Promise<TransactionType> {
    this._logger.debug('show one transaction resolver');
    this._logger.debug(id);
    return await this._transactionService.transaction(id);
  }

  @Query(() => [TransactionType])
  async transactions(): Promise<TransactionType[]> {
    this._logger.debug('show all transactions resolver');
    return await this._transactionService.transactions();
  }
}
