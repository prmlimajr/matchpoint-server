exports.up = function(knex) {
  return knex.schema.table('lead', table => {
    table.boolean('notify').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.table('lead', table => {
    table.dropColumn('notify');
  })
};