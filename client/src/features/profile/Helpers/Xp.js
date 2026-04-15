const base = 100;
const ratio = 1.1;

function xp_to_level_up(level) {
  if (level <= 0) {
    return 0;
  }

  return Math.floor((base * (Math.pow(ratio, level) - 1)) / (ratio - 1));
}

function current_level(xp) {
  if (xp < base) return 0;

  const level = Math.log((xp * (ratio - 1)) / base + 1) / Math.log(ratio);
  return Math.floor(level);
}

export { xp_to_level_up, current_level };
