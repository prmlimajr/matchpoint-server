exports.up = function(knex) {
  return knex.schema.table('company', table => {
    table.string('lat');
    table.string('lng');
    table.boolean('premium');
    table.string('firstPicture');
    table.string('secondPicture');
    table.string('thirdPicture');
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('lat');
    table.dropColumn('lng');
    table.boolean('premium');
    table.dropColumn('firstPicture');
    table.dropColumn('secondPicture');
    table.dropColumn('thirdPicture');
  })
};