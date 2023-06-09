exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.boolean('is_instructor');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('is_instructor');
  })
};