import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private _logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
  ) {}

  async transactions(): Promise<TransactionEntity[]> {
    this._logger.debug('show all transactions method');
    return await this._transactionRepository.find({
      relations: ['wallet'],
    });
  }

  async transaction(id: string): Promise<TransactionEntity> {
    this._logger.debug('show one transaction method');
    this._logger.debug(id);
    const transaction = await this._transactionRepository.findOne(id, {
      relations: ['wallet'],
    });
    if (!transaction) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }

    this._logger.debug({ transaction });
    return transaction;
  }

  async create(dto: CreateTransactionDto) {
    this._logger.debug('create one transaction method');
    this._logger.debug({ dto });
    const transaction = await this._transactionRepository.create(dto);
    this._logger.debug({ transaction });
    return await this._transactionRepository.save(transaction);
  }
}
