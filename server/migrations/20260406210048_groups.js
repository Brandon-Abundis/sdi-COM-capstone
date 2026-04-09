/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("groups", (table) => {
    table.increments();
    table.string("name");
    table.timestamp(true, true);

    table.specificType("admin_ids", "integer[]").defaultTo(knex.raw("'{}'"));
    table.specificType("user_ids", "integer[]").defaultTo(knex.raw("'{}'"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("groups");
};
