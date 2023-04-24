exports.up = function(knex) {
  return knex.schema.createTable('lead', function(table) {
    table.string('id').primary();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lead');
};