exports.up = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.string("type").notNullable().defaultTo("message");
    table.text("challenge_data").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.dropColumn("type");
    table.dropColumn("challenge_data");
  });
};
