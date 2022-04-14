import { WalletEntity } from '../../wallets/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const TRANSACTION_TABLE_NAME = 'transactions';
@Entity({ name: TRANSACTION_TABLE_NAME })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
  wallet: WalletEntity;
}
