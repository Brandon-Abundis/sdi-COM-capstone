const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

  const SF_RANKS = [
    "Spc1", "Spc2", "Spc3", "Spc4", "Sgt", "TSgt", "MSgt", "SMSgt",
    "CMSgt", "2nd Lt", "1st Lt", "Capt", "Maj", "LtCol", "Col", "General",
  ];

  const defaultPassword = await bcrypt.hash("password", SALT_ROUNDS);
  const adminPassword = await bcrypt.hash("123", SALT_ROUNDS);

  const allUserIds = Array.from({ length: 51 }, (_, i) => i + 1);
  // Pool for badges/titles/cosmetics (1-15)
  const assetPool = Array.from({ length: 15 }, (_, i) => i + 1);

  const users = [];

  for (let i = 0; i < 50; i++) {
    const currentId = i + 2;
    const possibleRivals = allUserIds.filter((id) => id !== currentId);

    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: defaultPassword,
      rank: faker.helpers.arrayElement(SF_RANKS),
      gender: faker.person.sex(),
      age: faker.number.int({ min: 18, max: 45 }),
      xp: faker.number.int({ min: 0, max: 5000 }),
      is_admin: false,

      rival_ids: faker.helpers.arrayElements(possibleRivals, faker.number.int({ min: 1, max: 3 })),

      // Logic: Pick a random count (0-7), then pick that many unique IDs from the 1-15 pool
      badges_ids: faker.helpers.arrayElements(assetPool, faker.number.int({ min: 0, max: 7 })),
      titles_ids: faker.helpers.arrayElements(assetPool, faker.number.int({ min: 0, max: 7 })),
      cosmetic_ids: faker.helpers.arrayElements(assetPool, faker.number.int({ min: 0, max: 7 })),
    });
  }

  users.unshift({
    is_admin: true,
    first_name: "admin",
    last_name: "Wegenke",
    password: adminPassword,
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