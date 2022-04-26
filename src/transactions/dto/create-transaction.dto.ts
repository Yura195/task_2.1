export class CreateTransactionDto {
  readonly amount: number;
  readonly description: string;
  readonly toId?: string;
  readonly fromId?: string;
}
