exports.up = function (knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments();
    table.text("text").notNullable();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("group_id").unsigned().references("id").inTable("groups").onDelete("CASCADE").nullable();
    table.integer("to_user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("messages");
};
