/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("security_logs", (table) => {
    table.increments();
    table.timestamp("occured_at").defaultTo(knex.fn.now());
    table.string("method"); // GET, POST, etc.
    table.string("action"); // e.g., 'UPDATE_PASSWORD'
    table.integer("status_code"); // e.g., 200, 401, 500

    // The "Who"
    table.integer("user_id").unsigned()
      .references("id").inTable("users").onDelete("SET NULL");

    // The "What" (Postgres JSONB is great for this)
    table.jsonb("metadata");

    table.string("ip_address");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("security_logs");
};
