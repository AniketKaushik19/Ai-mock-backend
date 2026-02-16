/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('user_monthly_interview_stats', (table) => {
    table.dropUnique(['user_id', 'year', 'month'], 'uniq_user_month');
    table.dropUnique(['user_id', 'subscription_instance_id'], 'uniq_usage');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('user_monthly_interview_stats', (table) => {
    table.unique(['user_id', 'year', 'month'], 'uniq_user_month');
    table.unique(['user_id', 'subscription_instance_id'], 'uniq_usage');
  });
}
