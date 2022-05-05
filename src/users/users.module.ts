import { UserEntity } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallets/entities/wallet.entity';

@Module({
  providers: [UsersService, UsersResolver],
  imports: [TypeOrmModule.forFeature([UserEntity, WalletEntity])],
  exports: [UsersService],
})
export class UsersModule {}
