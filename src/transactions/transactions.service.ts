import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
  ) {}

  async transactions(): Promise<TransactionEntity[]> {
    return await this._transactionRepository.find({
      relations: ['wallet', 'from'],
    });
  }

  async transaction(id: string): Promise<TransactionEntity> {
    const transaction = await this._transactionRepository.findOne(id, {
      relations: ['wallet', 'from'],
    });
    if (!transaction) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }
    return transaction;
  }

  async create(dto: CreateTransactionDto) {
    const transaction = await this._transactionRepository.create(dto);
    return await this._transactionRepository.save(transaction);
  }
}
