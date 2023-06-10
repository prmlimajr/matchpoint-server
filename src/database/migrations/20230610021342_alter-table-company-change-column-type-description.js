exports.up = function(knex) {
  return knex.schema.alterTable('company', table => {
    table.text('description', 'mediumtext').alter();
    table.text('bio', 'mediumtext').alter();
    table.text('history', 'mediumtext').alter();
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('description');
    table.dropColumn('bio');
    table.dropColumn('history');
  })
};