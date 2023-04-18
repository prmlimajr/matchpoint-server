exports.up = function(knex) {
  return knex.schema.createTable('sports-prices', function(table) {
    table.string('id').primary();
    table.string('sport_id').references('id').inTable('sports');
    table.string('court_id').references('id').inTable('courts');
    table.string('hourly_rate');
    table.string('monthly_rate');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sports-prices');
};