/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.boolean("is_admin").defaultTo(false);
    table.string("first_name");
    table.string("last_name");
    table.string("email");
    table.string("password");
    table.string("rank");
    table.string("gender");
    table.integer("age");
    table.integer("xp").defaultTo(0);

    table.timestamps(true, true);

    table.specificType("badges_ids", "integer[]");
    table.specificType("titles_ids", "integer[]");
    table.specificType("cosmetic_ids", "integer[]");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
