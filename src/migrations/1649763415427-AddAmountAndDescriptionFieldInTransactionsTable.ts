import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountAndDescriptionFieldInTransactionsTable1649763415427
  implements MigrationInterface
{
  name = 'AddAmountAndDescriptionFieldInTransactionsTable1649763415427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD "amount" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD "description" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP COLUMN "amount"
        `);
  }
}
