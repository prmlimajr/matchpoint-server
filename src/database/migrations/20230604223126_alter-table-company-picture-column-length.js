exports.up = function(knex) {
  return knex.schema.alterTable('company', table => {
    table.text('firstPicture', 'mediumtext').alter();
    table.text('secondPicture', 'mediumtext').alter();
    table.text('thirdPicture', 'mediumtext').alter();
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('firstPicture');
    table.dropColumn('secondPicture');
    table.dropColumn('thirdPicture');
  })
};