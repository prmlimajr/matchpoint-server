exports.up = function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.string('id').primary();
    table.string('company_id').references('id').inTable('company');
    table.string('question').notNullable();
    table.string('answer').notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions');
};