exports.up = function(knex) {
    return knex.schema.createTable('courts-reservations', function(table) {
      table.string('id').primary();
      table.string('court_id').references('id').inTable('courts');
      table.string('reserved_by').references('id').inTable('users');
      table.datetime('reserved_date').notNullable();
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('courts-reservations');
  };