const { faker } = require("@faker-js/faker");

const GROUP_LINES = [
  "PT at 0500 tomorrow, no excuses.",
  "Who's still sore from yesterday's deadlifts?",
  "Squad run is on for Friday, 3 miles, pace 7:30.",
  "Anyone want to add pull-ups to the end of session?",
  "Nice work today, Delta crushed it.",
  "Reminder: weigh-in is Thursday at 0630.",
  "Let's get a group bench session going this week.",
  "Formation PT canceled — check your email for the updated schedule.",
  "Who's hitting the gym after duty hours?",
  "Top scores from today's run just dropped. Check the board.",
  "Keep the intensity up, we have eval coming next month.",
  "Anyone have the schedule for next week's events?",
  "Solid turnout this morning, let's keep that energy.",
  "Who got a new PR today? Post your numbers.",
  "Remember to log your workouts in the app.",
  "We need 6 people for the relay race next Saturday.",
  "Morning formation moved to 0515, pass it on.",
  "Anyone need a spotter for max day? I'm available after 1600.",
  "Hydration check — you should be at 1L by 0800.",
  "Shoutout to everyone who showed up in the rain today.",
  "5K time trials are this Thursday. Start time: 0600.",
  "New group goal posted — check it out and commit.",
  "Rest day tomorrow. Mandatory.",
  "Anyone got recommendations for post-workout nutrition?",
  "Great session. See everyone at 0500.",
  "Who's doing the ruck march this weekend?",
  "Gear inspection Friday. Make sure you're squared away.",
  "Does anyone have extra resistance bands? Mine snapped.",
  "Can we push Wednesday's session to 0530 instead?",
  "Check the leaderboard — we're in 2nd place overall.",
];

const DM_PAIRS = [
  ["You hitting the bench challenge this week?", "For sure. You in?", "Obviously. Don't let me beat you.", "I'll try not to embarrass you.", "Ha. We'll see."],
  ["Bro that run this morning was brutal.", "Right? I didn't sleep enough.", "Same. Still finished though.", "That's the spirit.", "Next time I'm going sub-7.", "You're going to regret saying that."],
  ["You up for a ruck Saturday?", "What distance?", "12 miles. Full kit.", "I'm in. What time?", "0500 start.", "See you there."],
  ["Squad PT got moved to 0515.", "Noted. Thanks for the heads up.", "Don't be late.", "When am I ever late?", "Last Tuesday.", "That was different."],
  ["Your squat numbers are insane.", "I've been putting in the work.", "What's your program?", "5/3/1. Been on it 6 months.", "Might have to try it.", "Do it. Results speak for themselves."],
  ["You see the new event posted?", "Yeah, looks tough.", "We doing it together?", "Obviously.", "Let's go.", "Let's go."],
  ["How's the shoulder feeling?", "Better. PT cleared me for light weight.", "Good. Don't rush it.", "Appreciate it.", "We need you at 100%.", "I'll be good by next week."],
  ["Great run today.", "Thanks. Felt strong for once.", "You've been putting in the miles.", "Every morning.", "It shows.", "Means a lot, thanks."],
];

exports.seed = async function (knex) {
  await knex("messages").del();

  const groups = await knex("groups").select("id", "user_ids");
  const users = await knex("users").select("id");
  const userIds = users.map((u) => u.id);

  const messages = [];
  const now = new Date();

  // Group messages — 10-14 per group
  for (const group of groups) {
    const members = (group.user_ids || []).filter((id) => userIds.includes(id));
    if (members.length === 0) continue;

    const count = faker.number.int({ min: 10, max: 14 });
    const lines = faker.helpers.shuffle([...GROUP_LINES]).slice(0, count);

    for (let i = 0; i < lines.length; i++) {
      const minutesAgo = (lines.length - i) * faker.number.int({ min: 8, max: 25 });
      const ts = new Date(now.getTime() - minutesAgo * 60 * 1000);
      messages.push({
        text: lines[i],
        user_id: faker.helpers.arrayElement(members),
        group_id: group.id,
        to_user_id: null,
        created_at: ts,
        updated_at: ts,
      });
    }
  }

  // DM conversations — between user 1 (admin) and several other users
  const dmTargets = faker.helpers.arrayElements(
    userIds.filter((id) => id !== 1),
    Math.min(8, userIds.length - 1)
  );

  for (let t = 0; t < dmTargets.length; t++) {
    const otherId = dmTargets[t];
    const script = DM_PAIRS[t % DM_PAIRS.length];
    for (let i = 0; i < script.length; i++) {
      const sender = i % 2 === 0 ? otherId : 1;
      const minutesAgo = (script.length - i) * faker.number.int({ min: 3, max: 10 });
      const ts = new Date(now.getTime() - minutesAgo * 60 * 1000);
      messages.push({
        text: script[i],
        user_id: sender,
        group_id: null,
        to_user_id: sender === 1 ? otherId : 1,
        created_at: ts,
        updated_at: ts,
      });
    }
  }

  // Extra DMs between random non-admin pairs
  for (let i = 0; i < 6; i++) {
    const [a, b] = faker.helpers.arrayElements(userIds.filter((id) => id !== 1), 2);
    const script = faker.helpers.arrayElement(DM_PAIRS);
    for (let j = 0; j < script.length; j++) {
      const sender = j % 2 === 0 ? a : b;
      const recipient = sender === a ? b : a;
      const minutesAgo = (script.length - j) * faker.number.int({ min: 3, max: 10 });
      const ts = new Date(now.getTime() - minutesAgo * 60 * 1000);
      messages.push({
        text: script[j],
        user_id: sender,
        group_id: null,
        to_user_id: recipient,
        created_at: ts,
        updated_at: ts,
      });
    }
  }

  await knex("messages").insert(messages);
};
