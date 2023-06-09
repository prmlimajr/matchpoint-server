exports.up = function(knex) {
  return knex.schema.alterTable('company', table => {
    table.dropColumn('address');
    table.dropColumn('lat');
    table.dropColumn('lng');
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('address');
    table.dropColumn('lat');
    table.dropColumn('lng');
  })
};