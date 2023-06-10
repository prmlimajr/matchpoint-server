exports.up = function(knex) {
  return knex.schema.table('courts', table => {
    table.boolean('has_classes');
  })
};

exports.down = function(knex) {
  return knex.schema.table('courts', table => {
    table.dropColumn('has_classes');
  })
};