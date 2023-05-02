exports.up = function(knex) {
  return knex.schema.alterTable('company', table => {
    table.text('logo', 'mediumtext').alter();
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('logo');
  })
};