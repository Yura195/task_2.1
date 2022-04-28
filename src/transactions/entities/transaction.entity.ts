import { WalletEntity } from '../../wallets/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => WalletEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'to_id' })
  to: WalletEntity;

  @ManyToOne(() => WalletEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'from_id' })
  from: WalletEntity;
}
