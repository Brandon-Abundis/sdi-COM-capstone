const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('group_workouts').del();

  const workouts = [];

  for (let groupId = 1; groupId <= 8; groupId++) {
    workouts.push(
      {
        name: '2-Mile Run (avg)',
        type: 'Cardio',
        time: faker.number.int({ min: 990, max: 1110 }),
        distance: 2.0,
        reps: null,
        muscle_group: 'Full Body',
        notes: 'Squad 2-mile endurance run. ~17:30 avg time',
        group_id: groupId
      },
      {
        name: '1-Minute Sit-ups',
        type: 'Core',
        time: 60,
        distance: null,
        reps: faker.number.int({ min: 45, max: 60 }),
        muscle_group: 'Abs',
        weight: 0,
        notes: 'Group benchmark for 1-minute core endurance.',
        group_id: groupId
      },
      {
        name: 'Forearm Plank',
        type: 'Core',
        time: faker.number.int({ min: 120, max: 180 }),
        distance: null,
        reps: null,
        muscle_group: 'Core',
        weight: 0,
        notes: 'Isometric hold benchmark. avg hold time ~2:30 min',
        group_id: groupId
      },
      {
        name: 'Hand-Release Push-ups',
        type: 'Strength',
        time: 120, // 2 minutes (Alternative PFA option)
        distance: null,
        reps: faker.number.int({ min: 30, max: 50 }),
        muscle_group: 'Chest/Triceps',
        weight: 0,
        notes: '2-minute hand-release standard.',
        group_id: groupId
      }
    );
  }

  await knex('group_workouts').insert(workouts);
};
