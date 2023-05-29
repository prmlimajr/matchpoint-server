exports.up = function(knex) {
  return knex.schema.alterTable('sports', table => {
    table.dropForeign('user_id');
  })
};

exports.down = function(knex) {
  return knex.schema.table('sports', table => {
    table.dropColumn('user_id');
  })
};