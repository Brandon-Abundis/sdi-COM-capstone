const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('user_events').del();

  const events = [];
  const GOALS_PER_USER = 3;
  const WORKOUTS_PER_USER = 8;
  const TOTAL_USERS = 26; // 1 admin + 25 fakes

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {

    // Formula to find the starting ID for THIS user's data
    // (Example: User 2's first goal is ((2-1) * 3) + 1 = ID 4)
    const firstGoalId = ((userId - 1) * GOALS_PER_USER) + 1;
    const firstWorkoutId = ((userId - 1) * WORKOUTS_PER_USER) + 1;

    // Create 4 future events per user
    for (let i = 0; i < 4; i++) {
      events.push({
        name: faker.helpers.arrayElement(['Morning Session', 'Squad PT', 'Evening Grind', 'Personal Best Attempt']),
        date: faker.date.soon({ days: 14 }), // Future dates for a calendar
        time: `${faker.number.int({ min: 6, max: 20 })}:00`,

        // Pick specific IDs from the user's own previously seeded data
        goals_list: [firstGoalId, firstGoalId + 1],
        workouts_list: [firstWorkoutId, firstWorkoutId + 1, firstWorkoutId + 2],

        user_id: userId
      });
    }
  }

  await knex('user_events').insert(events);
};
