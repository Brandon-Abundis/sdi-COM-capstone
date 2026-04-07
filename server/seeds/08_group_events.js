const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('group_events').del();

  const groupEvents = [];
  const ENTRIES_PER_GROUP = 4; // Both goals and workouts have 4 per group
  const TOTAL_GROUPS = 8;

  for (let groupId = 1; groupId <= TOTAL_GROUPS; groupId++) {

    // Formula to find the starting ID for THIS group's data
    const firstId = ((groupId - 1) * ENTRIES_PER_GROUP) + 1;

    // Create 3 future events for each squad/group
    for (let i = 0; i < 3; i++) {
      groupEvents.push({
        name: faker.helpers.arrayElement(['Squad PT', 'Formation Run', 'Mock PFA', 'Section Training']),
        date: faker.date.soon({ days: 30 }),
        time: `${faker.number.int({ min: 5, max: 9 })}:00`, // Military PT usually early!

        // Take all 4 goals and 4 workouts belonging to this group
        goals_list: [firstId, firstId + 1, firstId + 2, firstId + 3],
        workouts_list: [firstId, firstId + 1, firstId + 2, firstId + 3],

        group_id: groupId
      });
    }
  }

  await knex('group_events').insert(groupEvents);
};
