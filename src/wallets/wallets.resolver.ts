import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionInput } from 'src/transactions/graphql/inputs/create-transaction.input';
import { CloseWalletInput } from './graphql/inputs/close-wallet.input';
import { WalletType } from './graphql/types/wallet.type';
import { WalletsService } from './wallets.service';

@Resolver(() => WalletType)
export class WalletsResolver {
  private _logger = new Logger(WalletsResolver.name);

  constructor(private readonly _walletService: WalletsService) {}

  @Query(() => WalletType)
  async wallet(
    @Args('id', { type: () => String }) id: string,
  ): Promise<WalletType> {
    this._logger.debug('get one wallet resolver');
    this._logger.debug({ id });
    return await this._walletService.wallet(id);
  }

  @Query(() => [WalletType])
  async wallets(): Promise<WalletType[]> {
    this._logger.debug('get all wallets resolver');
    return await this._walletService.wallets();
  }

  @Mutation(() => WalletType, { name: 'createWallet' })
  async createWallet(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<WalletType> {
    this._logger.debug('create one wallet resolver');
    this._logger.debug({ userId });
    return await this._walletService.createWallet(userId);
  }

  @Mutation(() => WalletType, { name: 'closeWallet' })
  async closeWallet(
    @Args('input') input: CloseWalletInput,
  ): Promise<WalletType> {
    this._logger.debug('close one wallet resolver');
    this._logger.debug({ input });
    return await this._walletService.closeWallet(input);
  }

  @Mutation(() => WalletType, { name: 'withdraw' })
  async withdraw(
    @Args('input') input: CreateTransactionInput,
  ): Promise<string> {
    this._logger.debug('withdraw transaction resolver');
    this._logger.debug({ input });
    return await this._walletService.withdraw(input);
  }

  @Mutation(() => WalletType, { name: 'deposit' })
  async deposit(@Args('input') input: CreateTransactionInput): Promise<string> {
    this._logger.debug('deposit transaction resolver');
    this._logger.debug({ input });
    return await this._walletService.deposit(input);
  }

  @Mutation(() => WalletType, { name: 'transfer' })
  async transfer(
    @Args('input') input: CreateTransactionInput,
  ): Promise<string> {
    this._logger.debug('transfer transaction resolver');
    this._logger.debug({ input });
    return await this._walletService.transfer(input);
  }
}
