import { MigrationInterface, QueryRunner } from "typeorm";

export class addedEntity1680986853593 implements MigrationInterface {
    name = 'addedEntity1680986853593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "photo" character varying NOT NULL DEFAULT 'image.png', "verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "email_index" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."follows_status_enum" AS ENUM('blocked', 'accepted', 'pending')`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."follows_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "followers_id" ("followsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_f52b76092c40f4b62b10ce2d35c" PRIMARY KEY ("followsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d9065fdafbe7357a49884dc5da" ON "followers_id" ("followsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_25bb453bef37def3d017915c9e" ON "followers_id" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "following_id" ("followsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_cb0c9c08a638765155c1125f01f" PRIMARY KEY ("followsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_57dee9febbead1c9d3f1f16c61" ON "following_id" ("followsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97f54113b110a02f144d8f0aa1" ON "following_id" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "followers_id" ADD CONSTRAINT "FK_d9065fdafbe7357a49884dc5da4" FOREIGN KEY ("followsId") REFERENCES "follows"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "followers_id" ADD CONSTRAINT "FK_25bb453bef37def3d017915c9ee" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following_id" ADD CONSTRAINT "FK_57dee9febbead1c9d3f1f16c618" FOREIGN KEY ("followsId") REFERENCES "follows"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "following_id" ADD CONSTRAINT "FK_97f54113b110a02f144d8f0aa1c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "following_id" DROP CONSTRAINT "FK_97f54113b110a02f144d8f0aa1c"`);
        await queryRunner.query(`ALTER TABLE "following_id" DROP CONSTRAINT "FK_57dee9febbead1c9d3f1f16c618"`);
        await queryRunner.query(`ALTER TABLE "followers_id" DROP CONSTRAINT "FK_25bb453bef37def3d017915c9ee"`);
        await queryRunner.query(`ALTER TABLE "followers_id" DROP CONSTRAINT "FK_d9065fdafbe7357a49884dc5da4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97f54113b110a02f144d8f0aa1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_57dee9febbead1c9d3f1f16c61"`);
        await queryRunner.query(`DROP TABLE "following_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25bb453bef37def3d017915c9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9065fdafbe7357a49884dc5da"`);
        await queryRunner.query(`DROP TABLE "followers_id"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TYPE "public"."follows_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
