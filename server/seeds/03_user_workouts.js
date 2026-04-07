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
    { name: 'Lunges', type: 'Strength', muscle: 'Legs' }
  ];

  const userWorkouts = [];

  for (let userId = 1; userId <= 51; userId++) {

    for (let i = 0; i < 8; i++) {
      const exercise = faker.helpers.arrayElement(EXERCISES);

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,

        reps: faker.number.int({ min: 1, max: 12 }),
        weight: faker.number.int({ min: 45, max: 315 }),
        time: null,
        distance: null,

        notes: faker.helpers.arrayElement([
          'Felt strong today',
          'Focusing on form',
          'Pushed through the last set',
          'Next time go heavier',
          'Form was a bit shaky'
        ]),

        user_id: userId,
        // Spreads the workouts over the last 30 days
        created_at: faker.date.recent({ days: 30 })
      });
    }
  }

  await knex('user_workouts').insert(userWorkouts);
};
