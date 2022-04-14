import { CloseWalletDto } from './dto/close-wallet.dto';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly _walletRepository: Repository<WalletEntity>,
    @Inject(forwardRef(() => TransactionsService))
    private readonly _transactionsService: TransactionsService,
  ) {}

  async create(): Promise<WalletEntity> {
    const wallet = await this._walletRepository.create();
    return await this._walletRepository.save(wallet);
  }

  async wallet(id: string): Promise<WalletEntity> {
    const wallet = await this._walletRepository.findOne(id, {
      relations: ['transactions'],
    });
    if (!wallet) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }
    return wallet;
  }

  async wallets(): Promise<WalletEntity[]> {
    return await this._walletRepository.find({
      relations: ['transactions'],
    });
  }

  async close(dto: CloseWalletDto): Promise<WalletEntity> {
    const { id, flag } = dto;
    const wallet = await this.wallet(id);
    wallet.accountClosed = flag;
    return await this._walletRepository.save(wallet);
  }

  async deposit(dto: CreateTransactionDto): Promise<string> {
    const { amount, description, walletId } = dto;
    const wallet = await this.wallet(walletId);

    if (wallet.accountClosed === true) {
      throw new HttpException(
        'This wallet is closed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    wallet.balance += amount;

    const transaction = await this._transactionsService.create({
      amount,
      description,
      walletId,
    });

    wallet.transactions.push(transaction);

    await this._walletRepository.save(wallet);
    return transaction.id;
  }

  async withdraw(dto: CreateTransactionDto): Promise<string> {
    const { amount, description, walletId } = dto;
    const wallet = await this.wallet(walletId);
    if (wallet.accountClosed === true) {
      throw new HttpException(
        'This wallet is closed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    wallet.balance -= amount;

    if (wallet.balance < 0) {
      throw new Error('Not enough money');
    }

    const transaction = await this._transactionsService.create({
      amount,
      description,
      walletId,
    });

    wallet.transactions.push(transaction);

    await this._walletRepository.save(wallet);
    return transaction.id;
  }
}
