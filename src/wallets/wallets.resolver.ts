import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateTransactionInput } from 'src/transactions/graphql/inputs/create-transaction.input';
import { CloseWalletInput } from './graphql/inputs/close-wallet.input';
import { WalletType } from './graphql/types/wallet.type';
import { WalletsService } from './wallets.service';

@Resolver(() => WalletType)
export class WalletsResolver {
  constructor(private readonly _walletService: WalletsService) {}

  @Query(() => WalletType)
  async wallet(
    @Args('id', { type: () => String }) id: string,
  ): Promise<WalletType> {
    return await this._walletService.wallet(id);
  }

  @Query(() => [WalletType])
  async wallets(): Promise<WalletType[]> {
    return await this._walletService.wallets();
  }

  @Mutation(() => WalletType, { name: 'createWallet' })
  async createWallet(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<WalletType> {
    return await this._walletService.createWallet(userId);
  }

  @Mutation(() => WalletType, { name: 'closeWallet' })
  async closeWallet(
    @Args('input', new ValidationPipe()) input: CloseWalletInput,
  ): Promise<WalletType> {
    return await this._walletService.closeWallet(input);
  }

  @Mutation(() => WalletType, { name: 'withdraw' })
  async withdraw(
    @Args('input', new ValidationPipe()) input: CreateTransactionInput,
  ): Promise<string> {
    return await this._walletService.withdraw(input);
  }

  @Mutation(() => WalletType, { name: 'deposit' })
  async deposit(
    @Args('input', new ValidationPipe()) input: CreateTransactionInput,
  ): Promise<string> {
    return await this._walletService.deposit(input);
  }

  @Mutation(() => WalletType, { name: 'transfer' })
  async transfer(
    @Args('input', new ValidationPipe()) input: CreateTransactionInput,
  ): Promise<string> {
    return await this._walletService.transfer(input);
  }
}
