import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePasswordResetTokensTable1710921600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create password_reset_tokens table
    await queryRunner.createTable(
      new Table({
        name: 'password_reset_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'used',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign key to users table
    await queryRunner.createForeignKey(
      'password_reset_tokens',
      new TableForeignKey({
        name: 'FK_PASSWORD_RESET_TOKENS_USER',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create index on token
    await queryRunner.createIndex(
      'password_reset_tokens',
      new TableIndex({
        name: 'IDX_PASSWORD_RESET_TOKENS_TOKEN',
        columnNames: ['token'],
      }),
    );

    // Create index on user_id
    await queryRunner.createIndex(
      'password_reset_tokens',
      new TableIndex({
        name: 'IDX_PASSWORD_RESET_TOKENS_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex(
      'password_reset_tokens',
      'IDX_PASSWORD_RESET_TOKENS_TOKEN',
    );
    await queryRunner.dropIndex(
      'password_reset_tokens',
      'IDX_PASSWORD_RESET_TOKENS_USER_ID',
    );

    // Drop foreign key
    await queryRunner.dropForeignKey(
      'password_reset_tokens',
      'FK_PASSWORD_RESET_TOKENS_USER',
    );

    // Drop table
    await queryRunner.dropTable('password_reset_tokens');
  }
}
