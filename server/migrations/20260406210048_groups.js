/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("groups", (table) => {
    table.increments();
    table.string("name");
    table.timestamp(true, true);

    table.text("admin_ids");
    table.text("user_ids");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("groups");
};
