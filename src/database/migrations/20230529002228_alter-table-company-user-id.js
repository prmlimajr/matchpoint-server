exports.up = function(knex) {
  return knex.schema.alterTable('company', table => {
    table.dropForeign('user_id');
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('user_id');
  })
};