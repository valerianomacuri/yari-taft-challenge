import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1760897777402 implements MigrationInterface {
    name = ' $npmConfigName1760897777402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "favorite_pokemon" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "pokemon_team" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pokemon_team"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "favorite_pokemon"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

}
