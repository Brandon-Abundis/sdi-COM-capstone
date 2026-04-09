const { faker } = require('@faker-js/faker');
const getUsers = require('../support/usersObject');

exports.seed = async function(knex) {
  await knex('user_goals').del();
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
  const userGoals = [];

  for (const user of users) {
    const ageFactor = user.age > 25 ? (user.age - 25) * 0.015 : 0;
    const isFemale = user.gender.toLowerCase() === 'female';

    for (let i = 0; i < 32; i++) {
      let exercise;
      if (i === 0) exercise = PFA_COMPONENTS[0];
      else if (i === 1) exercise = PFA_COMPONENTS[1];
      else if (i === 2) exercise = PFA_COMPONENTS[2];
      else exercise = faker.helpers.arrayElement(WEIGHTED_POOL);

      const isRun = exercise.name === '2-Mile Run';
      const isPushups = exercise.name === '1-Minute Push-ups';
      const isSitups = exercise.name === '1-Minute Sit-ups';
      const randomDate = faker.date.recent({ days: 180 });

      let reps = null, time = null, weight = 0;


      if (isRun) {
        let baseMin = 780 + (ageFactor * 540) + (isFemale ? 150 : 0);
        let baseMax = 1020 + (ageFactor * 540) + (isFemale ? 180 : 0);
        time = faker.number.int({ min: Math.floor(baseMin), max: Math.floor(baseMax) });
      } else if (isPushups || isSitups || exercise.bodyweight) {
        // Goals for Pull-ups, Push-ups, and Sit-ups (Bodyweight only)
        const repDrop = Math.floor(ageFactor * 15);
        const genderRepAdjust = (isPushups || exercise.name === 'Pull-ups') && isFemale ? 12 : 0;

        reps = faker.number.int({
          min: Math.max(10, 40 - repDrop - genderRepAdjust),
          max: 70 - repDrop - Math.floor(genderRepAdjust / 2)
        });
        weight = 0;
        if (isPushups || isSitups) time = 60;
      } else {
        // Weighted Goals
        reps = faker.number.int({ min: 1, max: 12 });
        const genderWeightMult = isFemale ? 0.7 : 1.0;

        if (exercise.name === 'Lunges' || exercise.name === 'Bicep Curls') {
          weight = faker.number.int({ min: 20, max: Math.floor(75 * genderWeightMult) });
        } else {
          weight = faker.number.int({ min: 45, max: Math.floor(365 * genderWeightMult) });
        }
      }

      userGoals.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: user.id,
        reps,
        weight,
        time,
        distance: isRun ? 2.0 : null,
        notes: i < 3 ? 'Mandatory Annual Goal' : `Target set on ${randomDate.toLocaleDateString()}`,
        created_at: randomDate,
        updated_at: randomDate
      });
    }
  }

  await knex.batchInsert('user_goals', userGoals, 100);
};