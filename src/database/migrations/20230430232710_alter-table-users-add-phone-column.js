exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.string('phone').notNullable();
    table.string('last_name').notNullable();
    table.boolean('notify').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('phone');
    table.dropColumn('last_name');
    table.dropColumn('notify');
  })
};