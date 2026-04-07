const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_goals').del();

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

  const userGoals = [];

  for (let userId = 1; userId <= 51; userId++) {
    for (let i = 0; i < 3; i++) {
      const exercise = faker.helpers.arrayElement(EXERCISES);
      const isRun = exercise.name === '2-Mile Run';

      userGoals.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: userId,
        // Set weights/reps for lifts, null for runs
        reps: isRun ? null : faker.number.int({ min: 1, max: 12 }),
        weight: isRun ? null : faker.number.int({ min: 45, max: 315 }),
        // Set time/distance for runs, null for lifts
        time: isRun ? faker.number.int({ min: 780, max: 1200 }) : null, // 13-20 mins
        distance: isRun ? 2.0 : null,
        notes: `Goal set on ${faker.date.recent().toLocaleDateString()}`
      });
    }
  }

  await knex('user_goals').insert(userGoals);
};
