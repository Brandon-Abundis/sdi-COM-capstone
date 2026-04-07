const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('user_workouts').del();

  const EXERCISES = [
    { name: 'Back Squat', type: 'Strength', muscle: 'Legs' },
    { name: 'Bench Press', type: 'Strength', muscle: 'Chest' },
    { name: 'Deadlift', type: 'Power', muscle: 'Back/Legs' },
    { name: 'Overhead Press', type: 'Strength', muscle: 'Shoulders' },
    { name: 'Pull-ups', type: 'Strength', muscle: 'Back' },
    { name: 'Bicep Curls', type: 'Hypertrophy', muscle: 'Arms' },
    { name: 'Lunges', type: 'Strength', muscle: 'Legs' },
    { name: '2-Mile Run', type: 'Cardio', muscle: 'Full Body' }
  ];

  const userWorkouts = [];

  for (let userId = 1; userId <= 51; userId++) {
    for (let i = 0; i < 8; i++) {
      const exercise = faker.helpers.arrayElement(EXERCISES);
      const isRun = exercise.name === '2-Mile Run';

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,

        // Lifts get reps/weight, Runs get null
        reps: isRun ? null : faker.number.int({ min: 1, max: 12 }),
        weight: isRun ? null : faker.number.int({ min: 45, max: 315 }),

        // Runs get time/distance, Lifts get null
        time: isRun ? faker.number.int({ min: 840, max: 1320 }) : null, // 14:00 to 22:00 mins
        distance: isRun ? 2.0 : null,

        notes: faker.helpers.arrayElement([
          'Felt strong today',
          'Focusing on form',
          'Pushed through the last set',
          'Next time go heavier',
          'Form was a bit shaky',
          'Great cardio session'
        ]),

        user_id: userId,
        created_at: faker.date.recent({ days: 30 })
      });
    }
  }

  await knex('user_workouts').insert(userWorkouts);
};
