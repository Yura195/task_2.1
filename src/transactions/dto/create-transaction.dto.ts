export class CreateTransactionDto {
  readonly amount: number;
  readonly description: string;
  readonly walletId?: string;
  readonly fromId?: string;
}
