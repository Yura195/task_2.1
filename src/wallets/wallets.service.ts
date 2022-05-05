import { CloseWalletDto } from './dto/close-wallet.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class WalletsService {
  private _logger = new Logger(WalletsService.name);

  constructor(
    @InjectRepository(WalletEntity)
    private readonly _walletRepository: Repository<WalletEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(TransactionEntity)
    private readonly _transactionsRepository: Repository<TransactionEntity>,
    private readonly _transactionsService: TransactionsService,
    private readonly _userService: UsersService,
    private readonly _connection: Connection,
  ) {}

  async createWallet(userId: string): Promise<WalletEntity> {
    this._logger.debug('create wallet method');
    this._logger.debug(userId);
    const user = await this._userService.user(userId);
    this._logger.debug({ user });
    const wallet = await this._walletRepository.create({ user });
    this._logger.debug({ wallet });
    user.wallets.push(wallet);
    await this._userRepository.save(user);
    return await this._walletRepository.save(wallet);
  }

  async wallet(id: string): Promise<WalletEntity> {
    this._logger.debug('show one wallet method');
    this._logger.debug(id);
    const wallet = await this._walletRepository.findOne(id, {
      relations: ['user', 'transactions'],
    });
    if (!wallet) {
      throw new HttpException('This wallet is not found', HttpStatus.NOT_FOUND);
    }
    this._logger.debug({ wallet });
    return wallet;
  }

  async wallets(): Promise<WalletEntity[]> {
    this._logger.debug('show all wallets method');
    return await this._walletRepository.find({
      relations: ['user', 'transactions'],
    });
  }

  async closeWallet(dto: CloseWalletDto): Promise<WalletEntity> {
    this._logger.debug('close wallet method');
    this._logger.debug({ dto });
    const { id, flag } = dto;
    const wallet = await this.wallet(id);
    this._logger.debug({ wallet });
    wallet.accountClosed = flag;
    this._logger.debug({ wallet });
    return await this._walletRepository.save(wallet);
  }

  async deposit(dto: CreateTransactionDto): Promise<string> {
    this._logger.debug('deposit transaction method');
    this._logger.debug({ dto });
    const { amount, description, toId } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const wallet = await this.wallet(toId);
      this._logger.debug({ wallet });
      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLock === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      this._logger.debug({ wallet });
      wallet.incoming += amount;

      const transaction = await this._transactionsService.create({
        amount,
        description,
        toId,
      });

      this._logger.debug({ transaction });
      await this._transactionsRepository.save(transaction);
      wallet.transactions.push(transaction);

      await this._walletRepository.save(wallet);
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'deposit method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(dto: CreateTransactionDto): Promise<string> {
    this._logger.debug('withdraw transaction method');
    this._logger.debug({ dto });
    const { amount, description, toId } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const wallet = await this.wallet(toId);
      this._logger.debug({ wallet });
      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLock === true) {
        throw new HttpException(
          'This wallet is locked',
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

      this._logger.debug({ transaction });
      wallet.transactions.push(transaction);

      await this._walletRepository.save(wallet);
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'withdraw method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(dto: CreateTransactionDto): Promise<string> {
    this._logger.debug('transfer transaction method');
    this._logger.debug({ dto });
    const { amount, description, toId, fromId } = dto;
    const queryRunner = await this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const wallet = await this.wallet(toId);
      this._logger.debug({ wallet });
      const senderWallet = await this.wallet(fromId);
      this._logger.debug({ senderWallet });

      if (wallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (wallet.accountLock === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (senderWallet.accountClosed === true) {
        throw new HttpException(
          'This wallet is closed',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      if (senderWallet.accountLock === true) {
        throw new HttpException(
          'This wallet is locked',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

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

      this._logger.debug({ transaction });
      await this._transactionsRepository.save(transaction);
      wallet.transactions.push(transaction);
      senderWallet.transactions.push(transaction);

      await this._walletRepository.save([senderWallet, wallet]);
      return transaction.id;
    } catch (e) {
      this._logger.error(e, 'transfer method error');
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
