exports.up = function(knex) {
  return knex.schema.createTable('working-days', function(table) {
    table.string('id').primary();
    table.string('court_id').references('id').inTable('courts');
    table.boolean('sunday');
    table.boolean('monday');
    table.boolean('tuesday');
    table.boolean('wednesday');
    table.boolean('thursday');
    table.boolean('friday');
    table.boolean('saturday');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('working-days');
};