import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountClosedFieldInWalletsTable1649674898150
  implements MigrationInterface
{
  name = 'CreateAccountClosedFieldInWalletsTable1649674898150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallets"
            ALTER COLUMN "account_closed"
            SET DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "wallets"
            ALTER COLUMN "account_closed" DROP DEFAULT
        `);
  }
}
