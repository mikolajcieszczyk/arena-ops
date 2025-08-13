import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { UserRole } from '../users/enums/user-role.enum';
import { UserStatus } from '../users/enums/user-status.enum';

export class CreateUsersTable1710835200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('${UserRole.ADMIN}', '${UserRole.STAFF}', '${UserRole.CLIENT}')
    `);

    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM ('${UserStatus.ACTIVE}', '${UserStatus.INACTIVE}')
    `);

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'user_role_enum',
            default: `'${UserRole.CLIENT}'`,
          },
          {
            name: 'status',
            type: 'user_status_enum',
            default: `'${UserStatus.ACTIVE}'`,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'preferences',
            type: 'jsonb',
            default: '{}',
          },
          {
            name: 'last_login',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create index on email
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );

    // Create index on role
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_ROLE',
        columnNames: ['role'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
    await queryRunner.dropIndex('users', 'IDX_USERS_ROLE');

    // Drop table
    await queryRunner.dropTable('users');

    // Drop enum types
    await queryRunner.query('DROP TYPE "user_role_enum"');
    await queryRunner.query('DROP TYPE "user_status_enum"');
  }
}
