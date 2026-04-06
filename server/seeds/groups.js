/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("groups").del();
  await knex("groups").insert([
    { name: "11sws", admin_ids: "1", user_ids: "1, 2, 3, 4" },
    { name: "22sws", admin_ids: "1", user_ids: "11, 2, 3, 4" },
  ]);
};
