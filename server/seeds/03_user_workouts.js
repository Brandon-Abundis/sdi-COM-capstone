const { faker } = require('@faker-js/faker');
const getUsers = require('../support/usersObject');

exports.seed = async function(knex) {
  await knex('user_workouts').del();
  const users = await getUsers();

  const BASE_EXERCISES = [
    { name: 'Back Squat', type: 'Strength', muscle: 'Legs', bodyweight: false },
    { name: 'Bench Press', type: 'Strength', muscle: 'Chest', bodyweight: false },
    { name: 'Deadlift', type: 'Power', muscle: 'Back/Legs', bodyweight: false },
    { name: 'Overhead Press', type: 'Strength', muscle: 'Shoulders', bodyweight: false },
    { name: 'Pull-ups', type: 'Strength', muscle: 'Back', bodyweight: true },
    { name: 'Bicep Curls', type: 'Hypertrophy', muscle: 'Arms', bodyweight: false },
    { name: 'Lunges', type: 'Strength', muscle: 'Legs', bodyweight: false }
  ];

  const PFA_COMPONENTS = [
    { name: '2-Mile Run', type: 'Cardio', muscle: 'Full Body', bodyweight: true },
    { name: '1-Minute Push-ups', type: 'Strength', muscle: 'Chest', bodyweight: true },
    { name: '1-Minute Sit-ups', type: 'Core', muscle: 'Abs', bodyweight: true }
  ];

  const WEIGHTED_POOL = [...BASE_EXERCISES, ...PFA_COMPONENTS, ...PFA_COMPONENTS, ...PFA_COMPONENTS];
  const userWorkouts = [];

  for (const user of users) {
    const ageFactor = user.age > 25 ? (user.age - 25) * 0.015 : 0;
    const isFemale = user.gender.toLowerCase() === 'female';

    for (let i = 0; i < 32; i++) {
      const exercise = faker.helpers.arrayElement(WEIGHTED_POOL);
      const isRun = exercise.name === '2-Mile Run';
      const isPFAStrength = exercise.name.includes('1-Minute');
      const randomDate = faker.date.recent({ days: 180 });

      let reps = null, time = null, weight = 0;

      if (isRun) {
        let baseMin = 840 + (ageFactor * 600) + (isFemale ? 150 : 0);
        let baseMax = 1140 + (ageFactor * 600) + (isFemale ? 180 : 0);
        time = faker.number.int({ min: Math.floor(baseMin), max: Math.floor(baseMax) });
      } else if (isPFAStrength || exercise.bodyweight) {
        // Handle Pull-ups, Push-ups, Sit-ups
        const repDrop = Math.floor(ageFactor * 20);
        const genderRepAdjust = (exercise.name.includes('Push-ups') || exercise.name === 'Pull-ups') && isFemale ? 15 : 0;

        reps = faker.number.int({
          min: Math.max(5, 30 - repDrop - genderRepAdjust),
          max: 60 - repDrop - Math.floor(genderRepAdjust / 2)
        });
        weight = 0; // Bodyweight exercise
        if (isPFAStrength) time = 60;
      } else {
        // Weighted Exercises
        reps = faker.number.int({ min: 1, max: 12 });
        const genderWeightMult = isFemale ? 0.65 : 1.0;

        if (exercise.name === 'Lunges' || exercise.name === 'Bicep Curls') {
          // Dumbbell weight range
          weight = faker.number.int({ min: 15, max: Math.floor(60 * genderWeightMult) });
        } else {
          // Barbell weight range (Squat, Bench, Deadlift)
          weight = faker.number.int({ min: 45, max: Math.floor(315 * genderWeightMult) });
        }
      }

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: user.id,
        reps,
        weight,
        time,
        distance: isRun ? 2.0 : null,
        notes: faker.helpers.arrayElement(['Felt strong', 'Standard pace', 'Good session', 'Focusing on form']),
        created_at: randomDate,
        updated_at: randomDate
      });
    }
  }

  await knex.batchInsert('user_workouts', userWorkouts, 100);
};