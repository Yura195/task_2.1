import { UserEntity } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const { name, email } = dto;

    const candidate = await this._userRepository.findOne({ email });
    if (candidate) {
      throw new HttpException(
        'This user with email ' + email + ' already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this._userRepository.create({ name, email });
    return await this._userRepository.save(user);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const candidate = await this.user(id);
    return await this._userRepository.softRemove(candidate);
  }

  async recoverUser(id: string): Promise<UserEntity> {
    return await this._userRepository.recover({ id });
  }

  async user(id: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne(id, {
      relations: ['wallets'],
    });

    if (!user) {
      throw new HttpException('This user is not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async users(): Promise<UserEntity[]> {
    return await this._userRepository.find({
      relations: ['wallets'],
    });
  }
}
