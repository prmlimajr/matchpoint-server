exports.up = function(knex) {
  return knex.schema.createTable('address', function(table) {
    table.string('id').primary();
    table.string('company_id').references('id').inTable('company');
    table.string('address').notNullable();
    table.string('lat');
    table.string('lng');
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('address');
};