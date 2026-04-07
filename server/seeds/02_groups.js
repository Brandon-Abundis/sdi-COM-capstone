const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("groups").del();

  const SF_GROUPS = [
    'Delta 11', '25 SRS', '33 RGS', '57 SAS', '98 SAS', '328 WPS', '392 CTS', '527 SAS'
  ]

  // const groups = [];

  const groups = SF_GROUPS.map(name => {
    return {
      name: name,
      // 1-2 admins per group
      admin_ids: Array.from(
        { length: faker.number.int({ min: 1, max: 2 }) },
        () => faker.number.int({ min: 1, max: 50 })
      ),
      // 5-10 users per group
      user_ids: Array.from(
        { length: faker.number.int({ min: 5, max: 10 }) },
        () => faker.number.int({ min: 1, max: 50 })
      )
    };
  })

  await knex('groups').insert(groups);
};
