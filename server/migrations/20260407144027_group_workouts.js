/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("group_workouts", (table) => {
    table.increments();
    table.string("name");
    table.string("type");
    table.integer("time");
    table.float("distance");
    table.integer("reps");
    table.string("muscle_group");
    table.integer("weight");
    table.string("notes");

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
  return knex.schema.dropTableIfExists('group_workouts');
};
