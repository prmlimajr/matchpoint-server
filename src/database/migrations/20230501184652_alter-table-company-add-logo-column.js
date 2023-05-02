exports.up = function(knex) {
  return knex.schema.table('company', table => {
    table.string('logo');
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('logo');
  })
};