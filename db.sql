/*
 Navicat Premium Data Transfer

 Source Server         : task_management
 Source Server Type    : PostgreSQL
 Source Server Version : 170006 (170006)
 Source Host           : localhost:5432
 Source Catalog        : task_management
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170006 (170006)
 File Encoding         : 65001

 Date: 08/11/2025 15:17:30
*/


-- ----------------------------
-- Sequence structure for Tasks_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "Tasks_id_seq";
CREATE SEQUENCE "Tasks_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for accounts_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "accounts_id_seq";
CREATE SEQUENCE "accounts_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for Tasks
-- ----------------------------
DROP TABLE IF EXISTS "Tasks";
CREATE TABLE "Tasks" (
  "id" int8 NOT NULL DEFAULT nextval('"Tasks_id_seq"'::regclass),
  "create_accounts_id" int8 NOT NULL,
  "update_accounts_id" int8,
  "accounts_id" int8 NOT NULL,
  "title" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default",
  "status" text COLLATE "pg_catalog"."default",
  "deadline" timestamptz(6)
)
;

-- ----------------------------
-- Records of Tasks
-- ----------------------------
BEGIN;
INSERT INTO "Tasks" ("id", "create_accounts_id", "update_accounts_id", "accounts_id", "title", "description", "status", "deadline") VALUES (4, 1, NULL, 1, 'Task Title', 'Task description', 'pending', '2026-01-01 06:59:59+07'), (6, 1, 1, 1, 'asdasd', 'asdasdasd', 'todo', '2025-11-08 20:17:00+07'), (3, 1, 1, 1, 'Task aman', 'Task descriptio nih', 'done', '2026-01-01 06:59:59+07');
COMMIT;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS "accounts";
CREATE TABLE "accounts" (
  "id" int8 NOT NULL DEFAULT nextval('accounts_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default",
  "is_active" bool NOT NULL DEFAULT true,
  "last_login" timestamptz(6),
  "created_at" timestamptz(6),
  "updated_at" timestamptz(6)
)
;

-- ----------------------------
-- Records of accounts
-- ----------------------------
BEGIN;
INSERT INTO "accounts" ("id", "name", "password", "email", "is_active", "last_login", "created_at", "updated_at") VALUES (2, 'Yogaanjay', 'B8PoT8owisMCUzAC4TCqwdvv4k84BZAVAK9luKKIpf4=', 'yogaanjay@company.com', 't', '0001-01-01 06:42:04+06:42:04', '2025-11-07 11:03:11.802564+07', '2025-11-07 11:03:11.802564+07'), (3, 'Test User', 'Odq4jzUCppT5N42re08JTqlD9hPk6QZWtkRubnRdl10=', 'test@example.com', 't', '2025-11-07 19:09:57.127775+07', '2025-11-07 19:09:48.823739+07', '2025-11-07 19:09:57.127655+07'), (1, 'Yoga', 'B8PoT8owisMCUzAC4TCqwdvv4k84BZAVAK9luKKIpf4=', 'yoga@company.com', 't', '2025-11-08 14:55:16.160347+07', '2025-11-07 10:49:06.931628+07', '2025-11-08 14:55:16.160198+07');
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "Tasks_id_seq"
OWNED BY "Tasks"."id";
SELECT setval('"Tasks_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "accounts_id_seq"
OWNED BY "accounts"."id";
SELECT setval('"accounts_id_seq"', 3, true);

-- ----------------------------
-- Primary Key structure for table Tasks
-- ----------------------------
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table accounts
-- ----------------------------
CREATE UNIQUE INDEX "idx_accounts_email" ON "accounts" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table accounts
-- ----------------------------
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Tasks
-- ----------------------------
ALTER TABLE "Tasks" ADD CONSTRAINT "fk_Tasks_account" FOREIGN KEY ("accounts_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "Tasks" ADD CONSTRAINT "fk_Tasks_create_user" FOREIGN KEY ("create_accounts_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "Tasks" ADD CONSTRAINT "fk_Tasks_update_user" FOREIGN KEY ("update_accounts_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
