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

    for (let i = 0; i < 320; i++) {
      const exercise = faker.helpers.arrayElement(WEIGHTED_POOL);
      const isRun = exercise.name === '2-Mile Run';
      const isPushUp = exercise.name.includes('Push-ups');
      const isSitUp = exercise.name.includes('Sit-ups');
      const isPFAStrength = isPushUp || isSitUp;
      const randomDate = faker.date.recent({ days: 365 });

      let reps = null, time = null, weight = 0;

      if (isRun) {
        // --- ULTRA-RARE RUN TIMES ---
        const runRarity = faker.number.float({ min: 0, max: 100 });
        const genderPenalty = isFemale ? 120 : 0;
        const agePenalty = ageFactor * 400;

        let baseSeconds;
        if (runRarity > 99.5) {
          // ULTRA ELITE (0.5%): 12:00 - 13:30 (720s - 810s)
          baseSeconds = faker.number.int({ min: 720, max: 810 });
        } else if (runRarity > 95) {
          // ELITE (4.5%): 13:31 - 15:00 (811s - 900s)
          baseSeconds = faker.number.int({ min: 811, max: 900 });
        } else if (runRarity > 75) {
          // ATHLETIC (20%): 15:01 - 18:00 (901s - 1080s)
          baseSeconds = faker.number.int({ min: 901, max: 1080 });
        } else {
          // STANDARD (75%): 18:01 - 24:00 (1081s - 1440s)
          baseSeconds = faker.number.int({ min: 1081, max: 1440 });
        }

        // Apply penalties (minimal impact on Elite to keep them at the top)
        const totalPenalty = (runRarity > 99.5) ? (agePenalty * 0.1) : agePenalty;
        time = Math.floor(baseSeconds + totalPenalty + genderPenalty);

      } else if (isPFAStrength || exercise.bodyweight) {
        const repDrop = Math.floor(ageFactor * 15);
        const genderAdjust = (isPushUp || exercise.name === 'Pull-ups') && isFemale ? 12 : 0;
        const rarityRoll = faker.number.float({ min: 0, max: 100 });
        let baseReps;

        if (rarityRoll > 99.8 && isPFAStrength) {
            baseReps = faker.number.int({ min: 72, max: isSitUp ? 85 : 76 });
        } else if (rarityRoll > 99.6) {
            baseReps = faker.number.int({ min: 55, max: 71 });
        } else if (rarityRoll > 87) {
            baseReps = faker.number.int({ min: 40, max: 54 });
        } else if (rarityRoll > 40) {
            baseReps = faker.number.int({ min: 20, max: 39 });
        } else {
            baseReps = faker.number.int({ min: 5, max: 19 });
        }

        reps = Math.max(0, baseReps - repDrop - genderAdjust);
        weight = 0;
        if (isPFAStrength) time = 60;

      } else {
        reps = faker.number.int({ min: 1, max: 12 });
        const genderWeightMult = isFemale ? 0.65 : 1.0;
        weight = (exercise.name === 'Lunges' || exercise.name === 'Bicep Curls')
          ? faker.number.int({ min: 15, max: Math.floor(60 * genderWeightMult) })
          : faker.number.int({ min: 45, max: Math.floor(315 * genderWeightMult) });
      }

      userWorkouts.push({
        name: exercise.name,
        type: exercise.type,
        muscle_group: exercise.muscle,
        user_id: user.id,
        reps: reps !== null ? Math.floor(reps) : null,
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
