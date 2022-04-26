import { TransactionEntity } from '../../transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export const WALLET_TABLE_NAME = 'wallets';
@Entity({ name: WALLET_TABLE_NAME })
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'float', default: 0 })
  incoming: number;

  @Column({ type: 'float', default: 0 })
  outgoing: number;

  @Column({ type: 'boolean', name: 'account_closed', default: false })
  accountClosed: boolean;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.to)
  transactions: TransactionEntity[];

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  user: UserEntity;
}
