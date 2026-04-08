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
      let exercise;

      // GUARANTEE all 3 PFA components for every user
      if (i === 0) {
        exercise = { name: '2-Mile Run', type: 'Cardio', muscle: 'Full Body' };
      } else if (i === 1) {
        exercise = { name: '1-Minute Push-ups', type: 'Strength', muscle: 'Chest' };
      } else if (i === 2) {
        exercise = { name: '1-Minute Sit-ups', type: 'Core', muscle: 'Abs' };
      } else {
        exercise = faker.helpers.arrayElement(EXERCISES);
      }

      const isRun = exercise.name === '2-Mile Run';
      const isPFAStrength = exercise.name.includes('1-Minute');

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: userId,

        // Logic for different workout types
        reps: isRun ? null : (isPFAStrength ? faker.number.int({ min: 35, max: 60 }) : faker.number.int({ min: 1, max: 12 })),
        weight: (isRun || isPFAStrength) ? 0 : faker.number.int({ min: 45, max: 315 }),

        time: isRun ? faker.number.int({ min: 840, max: 1140 }) : (isPFAStrength ? 60 : null),
        distance: isRun ? 2.0 : null,

        notes: i < 3 ? 'Official PT Test Component' : faker.helpers.arrayElement([
          'Felt strong today', 'Focusing on form', 'Pushed through', 'Next time go heavier'
        ]),

        created_at: faker.date.recent({ days: 30 })
      });
    }
  }

  await knex('user_workouts').insert(userWorkouts);
};
