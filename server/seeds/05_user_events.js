const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('user_events').del();

  const events = [];
  const GOALS_PER_USER = 6;     // Updated to your new seed count
  const WORKOUTS_PER_USER = 8;  // Matches your workouts seed
  const TOTAL_USERS = 51;       // Matches your users seed

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {

    // Calculate the exact ID ranges for THIS user
    const firstGoalId = ((userId - 1) * GOALS_PER_USER) + 1;
    const lastGoalId = userId * GOALS_PER_USER;

    const firstWorkoutId = ((userId - 1) * WORKOUTS_PER_USER) + 1;
    const lastWorkoutId = userId * WORKOUTS_PER_USER;

    // Create arrays of all possible IDs for this user
    const userGoalPool = Array.from({ length: GOALS_PER_USER }, (_, i) => firstGoalId + i);
    const userWorkoutPool = Array.from({ length: WORKOUTS_PER_USER }, (_, i) => firstWorkoutId + i);

    // Create 4 events for each user
    for (let i = 0; i < 4; i++) {
      let goals, workouts;
      let eventName = faker.helpers.arrayElement(['Morning Session', 'PT workout', 'Evening Grind', 'Personal Best Attempt']);

      if (i === 0) {
        // FORCE the first event to be the "PT Test" with the first 3 IDs
        eventName = 'Official PT Assessment';
        goals = [firstGoalId, firstGoalId + 1, firstGoalId + 2];
        workouts = [firstWorkoutId, firstWorkoutId + 1, firstWorkoutId + 2];
      } else {
        // Randomize: Pick 2 goals and 3 workouts from the user's specific pool
        goals = faker.helpers.arrayElements(userGoalPool, 2);
        workouts = faker.helpers.arrayElements(userWorkoutPool, 3);
      }

      events.push({
        name: eventName,
        date: faker.date.soon({ days: 14 }),
        time: `${faker.number.int({ min: 6, max: 20 })}:00`,
        goals_list: goals,
        workouts_list: workouts,
        user_id: userId
      });
    }
  }

  await knex('user_events').insert(events);
};
