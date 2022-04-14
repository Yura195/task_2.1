import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { WalletEntity } from './entities/wallet.entity';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';

@Module({
  providers: [WalletsService, WalletsResolver],
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    forwardRef(() => TransactionsModule),
  ],
  exports: [WalletsService],
})
export class WalletsModule {}
