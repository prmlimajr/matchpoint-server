exports.up = function(knex) {
    return knex.schema.createTable('business-hours', function(table) {
      table.string('id').primary();
      table.string('court_id').references('id').inTable('courts');
      table.string('start_at').notNullable();
      table.string('ends_at').notNullable();
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('business-hours');
  };