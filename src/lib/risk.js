export function computeRisk(record) {
  let score = 0;
  if (record.sleep < 6) score += 2;
  if (record.steps < 4000) score += 2;
  if (record.stress >= 3) score += 2;
  if (record.water < 6) score += 1;
  if (record.meals === "high-sugar" || record.meals === "high-fat") score += 2;
  if (record.meals === "irregular") score += 1;

  if (score >= 6) return "High";
  if (score >= 3) return "Medium";
  return "Low";
}
