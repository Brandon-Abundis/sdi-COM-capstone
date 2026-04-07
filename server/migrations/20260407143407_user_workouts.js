/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("user_workouts", (table) => {
    table.increments();
    table.string("name");
    table.string("type");
    table.integer("time");
    table.integer("distance");
    table.integer("reps");
    table.string("muscle_group");
    table.integer("weight");
    table.string("notes");

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
  return knex.schema.dropTableIfExists('user_workouts');
};
