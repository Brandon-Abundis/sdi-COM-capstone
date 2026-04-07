const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('scores').del();

  const scores = [];

  for (let userId = 1; userId <= 26; userId++) {
    scores.push({
      user_id: userId,
      // One random score between 100 and 5000
      score: faker.number.int({ min: 100, max: 5000 }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  }

  await knex('scores').insert(scores);
};
