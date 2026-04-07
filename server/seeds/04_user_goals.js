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
    { name: 'Lunges', type: 'Strength', muscle: 'Legs' }
  ];

  const userGoals = [];

  for (let userId = 1; userId <= 51; userId++) {

    // Give each user 3 random goals
    for (let i = 0; i < 3; i++) {
      const exercise = faker.helpers.arrayElement(EXERCISES);

      userGoals.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        // Randomize the numbers based on common gym ranges
        reps: faker.number.int({ min: 1, max: 12 }),
        weight: faker.number.int({ min: 45, max: 315 }),
        time: null, // Gym lifts usually don't track time
        distance: null,
        notes: `Goal set on ${faker.date.recent().toLocaleDateString()}`,
        user_id: userId
      });
    }
  }

  await knex('user_goals').insert(userGoals);
};
