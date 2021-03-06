import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { WalletEntity } from './entities/wallet.entity';
import { WalletsResolver } from './wallets.resolver';
import { WalletsService } from './wallets.service';

@Module({
  providers: [WalletsService, WalletsResolver],
  imports: [
    TypeOrmModule.forFeature([WalletEntity, UserEntity, TransactionEntity]),
    TransactionsModule,
    UsersModule,
  ],
})
export class WalletsModule {}
