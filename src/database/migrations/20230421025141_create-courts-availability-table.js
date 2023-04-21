exports.up = function(knex) {
    return knex.schema.createTable('courts-availability', function(table) {
      table.string('id').primary();
      table.string('court_id').references('id').inTable('courts');
      table.string('working_days_id').references('id').inTable('working-days');
      table.string('business_hours_id').references('id').inTable('business-hours');
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('courts-availability');
  };