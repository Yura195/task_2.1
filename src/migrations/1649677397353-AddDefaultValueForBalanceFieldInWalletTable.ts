import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValueForBalanceFieldInWalletTable1649677397353
  implements MigrationInterface
{
  name = 'AddDefaultValueForBalanceFieldInWalletTable1649677397353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallets"
            ALTER COLUMN "balance"
            SET DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallets"
            ALTER COLUMN "balance" DROP DEFAULT
        `);
  }
}
