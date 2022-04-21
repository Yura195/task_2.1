import { TransactionEntity } from 'src/transactions/entities/transaction.entity';
import { Module } from '@nestjs/common';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TransactionsService, TransactionsResolver],
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  exports: [TransactionsService],
})
export class TransactionsModule {}
