// Pure matching logic: no database, no Express. Easy to test and reuse.

// Trim, lowercase, collapse inner spaces, drop invalid items, remove duplicates.
const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];

  const seen = new Set();
  const result = [];

  for (const item of list) {
    if (typeof item !== "string") continue;
    const cleaned = item.trim().toLowerCase().replace(/\s+/g, " ");
    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned);
      result.push(cleaned);
    }
  }
  return result;
};

const calculateMatchScore = (jobRequirements, candidateSkills) => {
  const requirements = normalizeList(jobRequirements);
  const skillSet = new Set(normalizeList(candidateSkills));

  // No requirements means nothing to match, so return a safe zero result
  if (requirements.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: [], totalRequirements: 0 };
  }

  const matchedSkills = requirements.filter((req) => skillSet.has(req));
  const missingSkills = requirements.filter((req) => !skillSet.has(req));
  const score = Math.round((matchedSkills.length / requirements.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    totalRequirements: requirements.length,
  };
};

module.exports = { calculateMatchScore, normalizeList };
