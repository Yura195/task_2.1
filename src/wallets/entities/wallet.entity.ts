import { TransactionEntity } from '../../transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const WALLET_TABLE_NAME = 'wallets';
@Entity({ name: WALLET_TABLE_NAME })
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  balance?: number;

  @Column({ type: 'boolean', name: 'account_closed', default: false })
  accountClosed?: boolean;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.wallet)
  transactions: TransactionEntity[];
}
