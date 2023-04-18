exports.up = function(knex) {
  return knex.schema.createTable('courts', function(table) {
    table.string('id').primary();
    table.string('user_id').references('id').inTable('users');
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('address').notNullable();
    table.string('phone').notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('courts');
};