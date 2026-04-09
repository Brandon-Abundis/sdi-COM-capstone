const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 */
exports.seed = async function(knex) {
  await knex('global_events').del();

  const globalEvents = [];
  const TOTAL_USERS = 51;

  // We'll create 5 major global events
  const EVENT_TEMPLATES = [
    { title: 'Wegenke Worship', desc: 'This is an event to worship our lord and savior Matthew Wegenke.' },
    { title: 'March Mileage Madness', desc: 'Base-wide 100-mile challenge.' },
    { title: 'Summer Strength Series', desc: 'Max out your heavy lifts before August.' },
    { title: 'Operation: Iron Will', desc: '30-day consistency challenge.' },
    { title: 'Holiday Hero 5K', desc: 'Year-end community run event.' },
    { title: 'Spring PFA Prep', desc: 'Group sessions to maximize PFA scores.' }
  ];

  EVENT_TEMPLATES.forEach((template, index) => {
    // Generate a random pool of 20-40 participants for each event
    const participantCount = faker.number.int({ min: 20, max: 40 });
    const participants = faker.helpers.arrayElements(
      Array.from({ length: TOTAL_USERS }, (_, i) => i + 1),
      participantCount
    );

    // Pick 3 random goals/workouts from the Admin's (User 1) pool
    const adminGoals = [1, 2, 3];
    const adminWorkouts = [1, 2, 3];

    const startDate = faker.date.between({
      from: faker.date.recent({ days: 90 }),
      to: faker.date.soon({ days: 90 })
    });

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30); // Events last 30 days

    globalEvents.push({
      title: template.title,
      description: template.desc,
      start_date: startDate,
      end_date: endDate,
      start_time: '06:00',
      end_time: '18:00',
      completed: endDate < new Date(), // Auto-mark as completed if end date passed
      user_id: 1, // Created by Admin
      workouts_list: adminWorkouts,
      goals_list: adminGoals,
      participant_ids: participants
    });
  });

  await knex('global_events').insert(globalEvents);
};
