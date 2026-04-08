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
    // Increase to 6 goals so they have the 3 PFA goals + 3 random lifts
    for (let i = 0; i < 6; i++) {
      let exercise;

      // GUARANTEE the 3 PFA goals first
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

      userGoals.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: userId,

        // Goal Reps: PFA goals are higher (45-65), regular lifts are (1-12)
        reps: isRun ? null : (isPFAStrength ? faker.number.int({ min: 45, max: 65 }) : faker.number.int({ min: 1, max: 12 })),

        // Goal Weight: 0 for PFA/Bodyweight, randomized for others
        weight: (isRun || isPFAStrength) ? 0 : faker.number.int({ min: 45, max: 315 }),

        // Goal Time: Run is 13-18 mins (780-1080s), PFA strength is 60s
        time: isRun ? faker.number.int({ min: 780, max: 1080 }) : (isPFAStrength ? 60 : null),
        distance: isRun ? 2.0 : null,

        notes: i < 3 ? 'Annual PT Test Goal' : `Personal goal set on ${faker.date.recent().toLocaleDateString()}`
      });
    }
  }

  await knex('user_goals').insert(userGoals);
};
