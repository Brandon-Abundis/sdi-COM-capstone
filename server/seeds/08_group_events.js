const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('group_events').del();

  const groupEvents = [];
  const ENTRIES_PER_GROUP = 4;
  const TOTAL_GROUPS = 8;

  for (let groupId = 1; groupId <= TOTAL_GROUPS; groupId++) {
    const firstId = ((groupId - 1) * ENTRIES_PER_GROUP) + 1;

    // Increasing to 15 events per group to see the 90/10 split better
    for (let i = 0; i < 15; i++) {
      // 1. Generate Start Date
      const startDate = faker.date.between({
        from: faker.date.recent({ days: 30 }),
        to: faker.date.soon({ days: 60 })
      });

      // 2. Probability Logic (90% same day, 10% multi-day)
      let endDate = new Date(startDate);
      const isMultiDay = Math.random() > 0.90;

      if (isMultiDay) {
        endDate.setDate(startDate.getDate() + faker.number.int({ min: 2, max: 4 }));
      }

      // 3. Time Logic
      const startHour = faker.number.int({ min: 5, max: 8 }); // Early morning PT
      const duration = faker.number.int({ min: 1, max: 2 });

      groupEvents.push({
        name: isMultiDay ? 'Multi-day Field Exercise' : faker.helpers.arrayElement(['Squad PT', 'Formation Run', 'Mock PFA', 'Section Training']),
        start_date: startDate,
        end_date: endDate,
        start_time: `${startHour.toString().padStart(2, '0')}:00`,
        end_time: `${(startHour + duration).toString().padStart(2, '0')}:00`,
        goals_list: [firstId, firstId + 1, firstId + 2, firstId + 3],
        workouts_list: [firstId, firstId + 1, firstId + 2, firstId + 3],
        group_id: groupId
      });
    }
  }

  await knex('group_events').insert(groupEvents);
};
