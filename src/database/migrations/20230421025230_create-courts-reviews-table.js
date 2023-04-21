exports.up = function(knex) {
    return knex.schema.createTable('courts-reviews', function(table) {
      table.string('id').primary();
      table.string('court_id').references('id').inTable('courts');
      table.string('user_id').references('id').inTable('users');
      table.string('review').notNullable();
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('courts-reviews');
  };