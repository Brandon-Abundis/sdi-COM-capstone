/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      is_admin: true,
      first_name: "Brandon",
      last_name: "Abundis",
      password: "123",
      email: "abc@gmail.com",
      age: 25,
      xp: 100,
      badges_ids: "1,2",
      titles_ids: "1,2",
      cosmetic_ids: "3,4",
    },
  ]);
};
