import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1651131889344 implements MigrationInterface {
  name = 'CreateTables1651131889344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "account_closed" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "wallets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "incoming" double precision NOT NULL DEFAULT '0',
                "outgoing" double precision NOT NULL DEFAULT '0',
                "account_closed" boolean NOT NULL DEFAULT false,
                "userId" uuid,
                CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "amount" double precision NOT NULL,
                "description" character varying NOT NULL,
                "to_id" uuid,
                "from_id" uuid,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "wallets"
            ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_7f681ce46f24957781c744c3561" FOREIGN KEY ("to_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_811faa40e043801b0a4b3737d27" FOREIGN KEY ("from_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_811faa40e043801b0a4b3737d27"
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_7f681ce46f24957781c744c3561"
        `);
    await queryRunner.query(`
            ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"
        `);
    await queryRunner.query(`
            DROP TABLE "transactions"
        `);
    await queryRunner.query(`
            DROP TABLE "wallets"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
