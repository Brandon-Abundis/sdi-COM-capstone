/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("group_events", (table) => {
    table.increments();
    table.string("name");
    table.date("date");
    table.string("time");

    table.specificType("goals_list", "integer[]"); // basic postgres array
    table.specificType("workouts_list", "integer[]");

    table.integer("group_id")
      .unsigned() // consistancy with auto increment IDs
      .references("id") // colomn points to parent table
      .inTable("groups") // parent table name
      .onDelete("CASCADE"); // deletes child rows if user is deleted...

    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("group_events");
};
