import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from 'src/wallets/wallets.service';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  private _circularDependencyService: WalletsService;
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: Repository<TransactionEntity>,
    @Inject(forwardRef(() => WalletsService))
    private readonly _walletService: WalletsService,
    private _moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this._circularDependencyService = this._moduleRef.get(WalletsService, {
      strict: false,
    });
  }

  async transactions(): Promise<TransactionEntity[]> {
    return await this._transactionRepository.find({ relations: ['wallet'] });
  }

  async transaction(id: string): Promise<TransactionEntity> {
    return await this._transactionRepository.findOne(id, {
      relations: ['wallet'],
    });
  }

  async create(dto: CreateTransactionDto): Promise<TransactionEntity> {
    const transaction = await this._transactionRepository.create(dto);
    return await this._transactionRepository.save(transaction);
  }
}
