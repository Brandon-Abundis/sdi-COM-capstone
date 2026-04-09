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
  const EVENTS_PER_USER = 150;

  for (let userId = 1; userId <= TOTAL_USERS; userId++) {
    const firstGoalId = ((userId - 1) * GOALS_PER_USER) + 1;
    const firstWorkoutId = ((userId - 1) * WORKOUTS_PER_USER) + 1;

    const userGoalPool = Array.from({ length: GOALS_PER_USER }, (_, i) => firstGoalId + i);
    const userWorkoutPool = Array.from({ length: WORKOUTS_PER_USER }, (_, i) => firstWorkoutId + i);

    for (let i = 0; i < EVENTS_PER_USER; i++) {
      let goals, workouts;
      const EVENT_TIMES = {
        'Morning Session':       { min: 5,  max: 9  },
        'PT workout':            { min: 6,  max: 11 },
        'Evening Grind':         { min: 17, max: 20 },
        'Personal Best Attempt': { min: 7,  max: 18 },
        'Squad Training':        { min: 6,  max: 14 },
        'Endurance Test':        { min: 6,  max: 16 },
        'Official PT Assessment':{ min: 6,  max: 9  },
      };

      let eventName = faker.helpers.arrayElement(['Morning Session', 'PT workout', 'Evening Grind', 'Personal Best Attempt', 'Squad Training', 'Endurance Test']);

      if (i % 15 === 0) {
        eventName = 'Official PT Assessment';
        goals = [firstGoalId, firstGoalId + 1, firstGoalId + 2];
        workouts = [firstWorkoutId, firstWorkoutId + 1, firstWorkoutId + 2];
      } else {
        goals = faker.helpers.arrayElements(userGoalPool, faker.number.int({ min: 1, max: 4 }));
        workouts = faker.helpers.arrayElements(userWorkoutPool, faker.number.int({ min: 2, max: 5 }));
      }

      // 1. Generate Start Date
      const startDate = faker.date.between({
        from: faker.date.recent({ days: 180 }),
        to: faker.date.soon({ days: 365 })
      });

      // 2. Probability Logic for End Date
      let endDate = new Date(startDate);
      const isMultiDay = Math.random() > 0.90; // 10% chance for multi-day

      if (isMultiDay) {
        // Add 2-5 days for multi-day events
        endDate.setDate(startDate.getDate() + faker.number.int({ min: 2, max: 5 }));
      }

      const startHour = faker.number.int({ min: 5, max: 19 });
      const duration = faker.number.int({ min: 1, max: 2 });

      events.push({
        name: eventName,
        start_date: startDate,
        end_date: endDate,
        start_time: `${startHour.toString().padStart(2, '0')}:00`,
        end_time: `${(startHour + duration).toString().padStart(2, '0')}:00`,
        goals_list: goals,
        workouts_list: workouts,
        user_id: userId
      });
    }
  }

  await knex.batchInsert('user_events', events, 100);
};