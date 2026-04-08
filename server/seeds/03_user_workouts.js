const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('user_workouts').del();

  const BASE_EXERCISES = [
    { name: 'Back Squat', type: 'Strength', muscle: 'Legs' },
    { name: 'Bench Press', type: 'Strength', muscle: 'Chest' },
    { name: 'Deadlift', type: 'Power', muscle: 'Back/Legs' },
    { name: 'Overhead Press', type: 'Strength', muscle: 'Shoulders' },
    { name: 'Pull-ups', type: 'Strength', muscle: 'Back' },
    { name: 'Bicep Curls', type: 'Hypertrophy', muscle: 'Arms' },
    { name: 'Lunges', type: 'Strength', muscle: 'Legs' }
  ];

  const PFA_COMPONENTS = [
    { name: '2-Mile Run', type: 'Cardio', muscle: 'Full Body' },
    { name: '1-Minute Push-ups', type: 'Strength', muscle: 'Chest' },
    { name: '1-Minute Sit-ups', type: 'Core', muscle: 'Abs' }
  ];

  // Increase probability: Add PFA components 3 times each to the pool
  const WEIGHTED_POOL = [...BASE_EXERCISES, ...PFA_COMPONENTS, ...PFA_COMPONENTS, ...PFA_COMPONENTS];

  const userWorkouts = [];

  for (let userId = 1; userId <= 51; userId++) {
    for (let i = 0; i < 32; i++) {
      const exercise = faker.helpers.arrayElement(WEIGHTED_POOL);

      const isRun = exercise.name === '2-Mile Run';
      const isPFAStrength = exercise.name.includes('1-Minute');

      // Randomize timestamp: spread across the last 60 days
      const randomDate = faker.date.recent({ days: 365 });

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: userId,

        reps: isRun ? null : (isPFAStrength ? faker.number.int({ min: 35, max: 60 }) : faker.number.int({ min: 1, max: 12 })),
        weight: (isRun || isPFAStrength) ? 0 : faker.number.int({ min: 45, max: 315 }),

        time: isRun ? faker.number.int({ min: 840, max: 1140 }) : (isPFAStrength ? 60 : null),
        distance: isRun ? 2.0 : null,

        notes: faker.helpers.arrayElement([
          'Felt strong today', 'Focusing on form', 'Pushed through the last set',
          'Next time go heavier', 'Form was a bit shaky', 'Great session'
        ]),

        created_at: randomDate,
        updated_at: randomDate
      });
    }
  }

  // With 1,600+ records (51 * 32), batchInsert is mandatory to avoid Postgres errors
  await knex.batchInsert('user_workouts', userWorkouts, 100);
};
