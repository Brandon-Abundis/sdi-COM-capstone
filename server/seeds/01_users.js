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

  const users = [];

  for (let i=0; i<50; i++) {
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

      // 5 elements, random numerical IDs (1-5) -> unknown amount of stuff????
      badges_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
      titles_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 })),
      cosmetic_ids: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 5 }))
    })
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
    badges_ids: [1, 2],
    titles_ids: [1, 2],
    cosmetic_ids: [3, 4],
  });

  await knex("users").insert(users);
};
