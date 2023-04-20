import { MigrationInterface, QueryRunner } from "typeorm";

export class addedEntity1681948610661 implements MigrationInterface {
    name = 'addedEntity1681948610661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "content" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL`);
    }

}
