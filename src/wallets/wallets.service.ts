import { CloseWalletDto } from './dto/close-wallet.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly _walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(TransactionEntity)
    private readonly _transactionsRepository: Repository<TransactionEntity>,
    private readonly _transactionsService: TransactionsService,
    private readonly _userService: UsersService,
  ) {}

  async createWallet(userId: string): Promise<WalletEntity> {
    const user = await this._userService.user(userId);
    if (!user) {
      throw new HttpException('This user is not found', HttpStatus.NOT_FOUND);
    }
    const wallet = await this._walletRepository.create({ user });
    user.wallets.push(wallet);
    await this._userRepository.save(user);
    return await this._walletRepository.save(wallet);
  }

  async wallet(id: string): Promise<WalletEntity> {
    const wallet = await this._walletRepository.findOne(id, {
      relations: ['transactions', 'user'],
    });
    if (!wallet) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }
    return wallet;
  }

  async wallets(): Promise<WalletEntity[]> {
    return await this._walletRepository.find({
      relations: [
        'user',
        'transactions',
        'transactions.wallet',
        'transactions.from',
      ],
    });
  }

  async closeWallet(dto: CloseWalletDto): Promise<WalletEntity> {
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

  async transfer(dto: CreateTransactionDto): Promise<string> {
    const { amount, description, walletId, fromId } = dto;

    const wallet = await this.wallet(walletId);

    if (!wallet) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }

    const senderWallet = await this.wallet(fromId);

    if (!senderWallet) {
      throw new HttpException(
        "This sender's wallet is not found",
        HttpStatus.NOT_FOUND,
      );
    }

    senderWallet.balance -= amount;

    if (senderWallet.balance < 0) {
      throw new Error('Not enough money');
    }

    wallet.balance += amount;

    const transaction = await this._transactionsService.create({
      amount,
      description,
      walletId,
      fromId,
    });

    transaction.wallet = wallet;
    transaction.from = senderWallet;

    await this._transactionsRepository.save(transaction);
    wallet.transactions.push(transaction);
    senderWallet.transactions.push(transaction);

    await this._walletRepository.save(senderWallet);
    await this._walletRepository.save(wallet);
    return transaction.id;
  }
}
