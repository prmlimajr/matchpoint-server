exports.up = function(knex) {
  return knex.schema.table('company', table => {
    table.string('bio');
    table.string('history');
    table.boolean('vip');
    table.string('facebook');
    table.string('instagram');
    table.string('cellphone');
  })
};

exports.down = function(knex) {
  return knex.schema.table('company', table => {
    table.dropColumn('bio');
    table.dropColumn('history');
    table.boolean('vip');
    table.dropColumn('facebook');
    table.dropColumn('instagram');
    table.dropColumn('cellphone');
  })
};