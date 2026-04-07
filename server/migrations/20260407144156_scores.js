/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("scores", (table) => {
    table.increments();
    table.integer("score");

    table.integer("user_id")
      .unsigned() // consistancy with auto increment IDs
      .references("id") // colomn points to parent table
      .inTable("users") // parent table name
      .onDelete("CASCADE"); // deletes child rows if user is deleted...

    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('scores');
};
