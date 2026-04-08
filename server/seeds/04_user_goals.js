const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('user_goals').del();

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

  // Weighted pool to increase PFA goal frequency
  const WEIGHTED_POOL = [...BASE_EXERCISES, ...PFA_COMPONENTS, ...PFA_COMPONENTS, ...PFA_COMPONENTS];

  const userGoals = [];

  for (let userId = 1; userId <= 51; userId++) {
    for (let i = 0; i < 32; i++) {
      let exercise;

      // Ensure at least one of each PFA goal exists in the user's list
      if (i === 0) exercise = PFA_COMPONENTS[0];
      else if (i === 1) exercise = PFA_COMPONENTS[1];
      else if (i === 2) exercise = PFA_COMPONENTS[2];
      else exercise = faker.helpers.arrayElement(WEIGHTED_POOL);

      const isRun = exercise.name === '2-Mile Run';
      const isPFAStrength = exercise.name.includes('1-Minute');
      const randomDate = faker.date.recent({ days: 365 });

      userGoals.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: userId,

        reps: isRun ? null : (isPFAStrength ? faker.number.int({ min: 45, max: 65 }) : faker.number.int({ min: 1, max: 12 })),
        weight: (isRun || isPFAStrength) ? 0 : faker.number.int({ min: 45, max: 315 }),

        time: isRun ? faker.number.int({ min: 780, max: 1080 }) : (isPFAStrength ? 60 : null),
        distance: isRun ? 2.0 : null,

        notes: i < 3 ? 'Mandatory Annual Goal' : `Target set on ${randomDate.toLocaleDateString()}`,
        created_at: randomDate,
        updated_at: randomDate
      });
    }
  }

  // Batch insert due to high volume (51 * 32 = 1,632 rows)
  await knex.batchInsert('user_goals', userGoals, 100);
};