/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('badges').del()
  await knex('badges').insert([
    { id: 1, name: 'Iron Will', description: 'Awarded for completing a 7-day streak', category: 'consistency', rarity: 'uncommon' },
    { id: 2, name: 'March Maniac', description: 'Earned during the March Mileage Madness event', category: 'event', rarity: 'limited' },
    { id: 3, name: 'Clutch Performance', description: 'Hit a personal record during a sports event', category: 'performance', rarity: 'rare' },
    { id: 4, name: 'Grind Mode', description: 'Log activity every day for 30 days', category: 'consistency', rarity: 'epic' },
    { id: 5, name: 'Ultramarathoner', description: 'Accumulate 100+ miles tracked in a month', category: 'milestone', rarity: 'legendary' },
    { id: 6, name: 'Heavy Hitter', description: 'Hit a weightlifting PR milestone', category: 'performance', rarity: 'rare' },
    { id: 7, name: 'Step Daddy', description: 'Win a step-count competition in a week', category: 'competition', rarity: 'uncommon' },
    { id: 8, name: 'Consistency King/Queen', description: 'Never miss a weekly goal for a full month', category: 'consistency', rarity: 'epic' },
    { id: 9, name: 'Underdog', description: 'Jump 2+ ranks in a single season', category: 'rank', rarity: 'rare' },
    { id: 10, name: 'Legendary Grinder', description: 'Reach the Legendary shop rarity tier', category: 'progression', rarity: 'legendary' },
    { id: 11, name: 'Social Butterfly', description: 'Participate in 5 group leaderboard events', category: 'social', rarity: 'common' },
    { id: 12, name: 'Comeback Kid', description: 'Return after a 2-week gap and complete a full week', category: 'retention', rarity: 'rare' },
    { id: 13, name: 'Cold Start', description: 'First workout ever logged on the app', category: 'milestone', rarity: 'common' },
    { id: 14, name: 'Rival Crusher', description: 'Beat your unit leaderboard rival 3 weeks in a row', category: 'competition', rarity: 'epic' },
    { id: 15, name: 'Global Contender', description: 'Break into the global top 100', category: 'rank', rarity: 'legendary' }
  ]);
};
