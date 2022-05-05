import { UserEntity } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private _logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    this._logger.debug('create user method');
    this._logger.debug({ dto });
    const { name, email } = dto;

    const candidate = await this._userRepository.findOne({ email });
    this._logger.debug({ candidate });
    if (candidate) {
      throw new HttpException(
        'This user with email ' + email + ' already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this._userRepository.create({ name, email });
    this._logger.debug({ user });
    return await this._userRepository.save(user);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    this._logger.debug('delete user method');
    this._logger.debug(id);
    const candidate = await this.user(id);
    this._logger.debug({ candidate });
    for (const wallet of candidate.wallets) {
      wallet.accountLock = true;
    }
    return await this._userRepository.softRemove(candidate);
  }

  async recoverUser(id: string): Promise<UserEntity> {
    this._logger.debug('recover user method');
    const candidate = await this.user(id);
    this._logger.debug({ candidate });
    for (const wallet of candidate.wallets) {
      wallet.accountLock = false;
    }
    return await this._userRepository.recover(candidate);
  }

  async user(id: string): Promise<UserEntity> {
    this._logger.debug('show one user method');
    this._logger.debug(id);
    const user = await this._userRepository.findOne(id, {
      relations: ['wallets'],
    });

    if (!user) {
      throw new HttpException('This user is not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async users(): Promise<UserEntity[]> {
    this._logger.debug('show all users method');
    return await this._userRepository.find({
      relations: ['wallets'],
    });
  }
}
