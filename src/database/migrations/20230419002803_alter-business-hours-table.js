exports.up = function(knex) {
  return knex.schema.alterTable('business-hours', function(t) {
    t.string('start_at').alter();
    t.string('ends_at').alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('business-hours', function(t) {
    t.datetime('start_at');
    t.datetime('ends_at');
  });
};