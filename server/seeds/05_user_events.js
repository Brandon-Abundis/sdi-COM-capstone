const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('user_events').del();

  const events = [];
  const GOALS_PER_USER = 32;
  const WORKOUTS_PER_USER = 32;
  const TOTAL_USERS = 51;

  // ~78 weeks (18 months) * 2 events per week = ~150 events
  const EVENTS_PER_USER = 150;

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {

    const firstGoalId = ((userId - 1) * GOALS_PER_USER) + 1;
    const firstWorkoutId = ((userId - 1) * WORKOUTS_PER_USER) + 1;

    const userGoalPool = Array.from({ length: GOALS_PER_USER }, (_, i) => firstGoalId + i);
    const userWorkoutPool = Array.from({ length: WORKOUTS_PER_USER }, (_, i) => firstWorkoutId + i);

    for (let i = 0; i < EVENTS_PER_USER; i++) {
      let goals, workouts;
      let eventName = faker.helpers.arrayElement(['Morning Session', 'PT workout', 'Evening Grind', 'Personal Best Attempt', 'Squad Training', 'Endurance Test']);

      // Every 15th event (~once every 2 months) is an Official Assessment
      if (i % 15 === 0) {
        eventName = 'Official PT Assessment';
        goals = [firstGoalId, firstGoalId + 1, firstGoalId + 2];
        workouts = [firstWorkoutId, firstWorkoutId + 1, firstWorkoutId + 2];
      } else {
        goals = faker.helpers.arrayElements(userGoalPool, faker.number.int({ min: 1, max: 4 }));
        workouts = faker.helpers.arrayElements(userWorkoutPool, faker.number.int({ min: 2, max: 5 }));
      }

      events.push({
        name: eventName,
        // SPREAD: 180 days (6 months) back, 365 days (1 year) forward
        start_date: faker.date.between({
          from: faker.date.recent({ days: 180 }),
          to: faker.date.soon({ days: 365 })
        }),
        // Ensuring 24-hour format with leading zeros (e.g., 08:00)
        start_time: `${faker.number.int({ min: 5, max: 20 }).toString().padStart(2, '0')}:00`,
        goals_list: goals,
        workouts_list: workouts,
        user_id: userId
      });
    }
  }

  // With 7,500+ records, batchInsert is essential for performance
  await knex.batchInsert('user_events', events, 100);
};