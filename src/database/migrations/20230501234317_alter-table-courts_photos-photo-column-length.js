exports.up = function(knex) {
  return knex.schema.alterTable('courts-photos', table => {
    table.text('url', 'mediumtext').alter();
  })
};

exports.down = function(knex) {
  return knex.schema.table('courts-photos', table => {
    table.dropColumn('url');
  })
};