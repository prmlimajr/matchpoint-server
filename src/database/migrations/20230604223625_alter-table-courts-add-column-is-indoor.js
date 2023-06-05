exports.up = function(knex) {
  return knex.schema.table('courts', table => {
    table.boolean('is_indoor');
    table.string('lat');
    table.string('lng');
    table.string('sports');
  })
};

exports.down = function(knex) {
  return knex.schema.table('courts', table => {
    table.dropColumn('is_indoor');
    table.dropColumn('lat');
    table.dropColumn('lng');
    table.dropColumn('sports')
  })
};