import { MigrationInterface, QueryRunner } from "typeorm";

export class addedEntity1681946642915 implements MigrationInterface {
    name = 'addedEntity1681946642915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."user_id_index"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "user_id_index" ON "posts" ("user_id") `);
    }

}
