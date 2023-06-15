exports.up = function(knex) {
  return knex.schema.table('company', table => {
    table.string('user_id').references('id').inTable('users');;
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('user_id');
  })
};