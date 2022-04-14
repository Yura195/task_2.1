import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from 'src/wallets/wallets.module';
@Module({
  providers: [TransactionsService, TransactionsResolver],
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    forwardRef(() => WalletsModule),
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
