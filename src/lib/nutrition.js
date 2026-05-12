/**
 * Nutrition calculation utilities
 * Provides BMI calculation, calorie estimation, and BMI classification
 */

export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "#eff6ff" };
  if (bmi < 25) return { label: "Normal", color: "#22c55e", bg: "#f0fdf4" };
  if (bmi < 30) return { label: "Overweight", color: "#f59e0b", bg: "#fffbeb" };
  return { label: "Obese", color: "#ef4444", bg: "#fef2f2" };
}

export function getBMIPercentage(bmi) {
  // Map BMI to a 0-100 percentage for visual display (range 10-40)
  const min = 10;
  const max = 40;
  const clamped = Math.max(min, Math.min(max, bmi));
  return ((clamped - min) / (max - min)) * 100;
}

export function calculateTDEE(weightKg, heightCm, age, goal, targetWeightKg = null, timeframeWeeks = null) {
  // Mifflin-St Jeor equation (average of male/female)
  const bmrMale = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const bmrFemale = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const bmr = (bmrMale + bmrFemale) / 2;

  // Assume moderate activity level (1.55)
  const tdee = bmr * 1.55;

  // If user provided target weight and timeframe, calculate exact caloric offset
  // 1 kg of body weight is approx 7700 calories
  if (targetWeightKg && timeframeWeeks && timeframeWeeks > 0) {
    const weightDiff = Math.abs(targetWeightKg - weightKg);
    const totalCaloriesNeeded = weightDiff * 7700;
    const dailyCalorieOffset = totalCaloriesNeeded / (timeframeWeeks * 7);

    if (goal === "lose") {
      // Safety check: don't recommend dropping below 1200 calories
      return Math.max(1200, Math.round(tdee - dailyCalorieOffset));
    } else if (goal === "gain") {
      return Math.round(tdee + dailyCalorieOffset);
    }
  }

  // Adjust based on goal (default offset if no timeframe provided)
  switch (goal) {
    case "lose":
      return Math.round(tdee - 500); // 500 calorie deficit
    case "gain":
      return Math.round(tdee + 400); // 400 calorie surplus
    case "maintain":
    default:
      return Math.round(tdee);
  }
}

export function calculateMacros(calories, goal) {
  let proteinPct, carbsPct, fatPct;

  switch (goal) {
    case "lose":
      proteinPct = 0.35;
      carbsPct = 0.35;
      fatPct = 0.30;
      break;
    case "gain":
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
    case "maintain":
    default:
      proteinPct = 0.30;
      carbsPct = 0.40;
      fatPct = 0.30;
      break;
  }

  return {
    protein: { grams: Math.round((calories * proteinPct) / 4), percentage: Math.round(proteinPct * 100) },
    carbs: { grams: Math.round((calories * carbsPct) / 4), percentage: Math.round(carbsPct * 100) },
    fat: { grams: Math.round((calories * fatPct) / 9), percentage: Math.round(fatPct * 100) },
  };
}
