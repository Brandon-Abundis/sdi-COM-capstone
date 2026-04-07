const { faker } = require('@faker-js/faker');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  const SF_RANKS = [
    'Spc1', 'Spc2', 'Spc3', 'Spc4', 'Sgt', 'TSgt', 'MSgt', 'SMSgt', 'CMSgt',
    '2nd Lt', '1st Lt', 'Capt', 'Maj', 'LtCol', 'Col', 'General'
  ];

  const allIds = Array.from({ length: 51 }, (_, i) => i + 1);

  const users = [];

  for (let i = 0; i < 50; i++) {
    const currentId = i + 2; // Offset by 2 because admin is ID 1

    // Pick 1 to 3 rivals, excluding the current user's ID
    const possibleRivals = allIds.filter(id => id !== currentId);
    const rivalCount = faker.number.int({ min: 1, max: 3 });

    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'hashed_password_here',
      rank: faker.helpers.arrayElement(SF_RANKS),
      gender: faker.person.sex(),
      age: faker.number.int({ min: 18, max: 45 }),
      xp: faker.number.int({ min: 0, max: 5000 }),
      is_admin: false,

      // New Rival IDs logic
      rival_ids: faker.helpers.arrayElements(possibleRivals, rivalCount),

      badges_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
      titles_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
      cosmetic_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 }))
    });
  }
  // admin user at the top
  users.unshift({
    is_admin: true,
    first_name: "admin",
    last_name: "Wegenke",
    password: "123",
    email: "abc@gmail.com",
    rank: "General",
    gender: "Male",
    age: 21,
    xp: 100,
    rival_ids: [2, 3, 4],
    badges_ids: [1, 2],
    titles_ids: [1, 2],
    cosmetic_ids: [3, 4],
  });

  await knex("users").insert(users);
};
