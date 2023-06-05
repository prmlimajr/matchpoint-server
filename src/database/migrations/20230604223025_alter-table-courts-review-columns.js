exports.up = function(knex) {
  return knex.schema.alterTable('courts', table => {
    table.dropColumn('name');
    table.dropColumn('description');
    table.dropColumn('phone');
  })
};

exports.down = function(knex) {
  return knex.schema.table('courts', table => {
    table.dropColumn('name');
    table.dropColumn('description');
    table.dropColumn('phone');
  })
};