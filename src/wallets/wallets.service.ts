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
        'transactions.to',
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
    const { amount, description, toId } = dto;
    const wallet = await this.wallet(toId);

    if (wallet.accountClosed === true) {
      throw new HttpException(
        'This wallet is closed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    wallet.incoming += amount;

    const transaction = await this._transactionsService.create({
      amount,
      description,
      toId,
    });

    wallet.transactions.push(transaction);

    await this._walletRepository.save(wallet);
    return transaction.id;
  }

  async withdraw(dto: CreateTransactionDto): Promise<string> {
    const { amount, description, toId } = dto;
    const wallet = await this.wallet(toId);
    if (wallet.accountClosed === true) {
      throw new HttpException(
        'This wallet is closed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    const negativeAmount = wallet.incoming < amount;

    if (negativeAmount) {
      throw new Error('Not enough money');
    }

    wallet.outgoing += amount;
    wallet.incoming -= amount;

    const transaction = await this._transactionsService.create({
      amount,
      description,
      toId,
    });

    wallet.transactions.push(transaction);

    await this._walletRepository.save(wallet);
    return transaction.id;
  }

  async transfer(dto: CreateTransactionDto): Promise<string> {
    const { amount, description, toId, fromId } = dto;

    const wallet = await this.wallet(toId);

    const senderWallet = await this.wallet(fromId);

    senderWallet.outgoing += amount;
    senderWallet.incoming -= amount;

    if (senderWallet.incoming < 0) {
      throw new Error('Not enough money');
    }

    wallet.incoming += amount;

    const transaction = await this._transactionsService.create({
      amount,
      description,
      toId,
      fromId,
    });

    transaction.to = wallet;
    transaction.from = senderWallet;

    await this._transactionsRepository.save(transaction);
    wallet.transactions.push(transaction);
    senderWallet.transactions.push(transaction);

    await this._walletRepository.save([senderWallet, wallet]);
    return transaction.id;
  }
}
