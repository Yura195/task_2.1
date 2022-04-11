import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { WalletsService } from './wallets.service';

@Module({
  controllers: [],
  providers: [WalletsService],
  imports: [TypeOrmModule.forFeature([WalletEntity])],
})
export class WalletsModule {}
