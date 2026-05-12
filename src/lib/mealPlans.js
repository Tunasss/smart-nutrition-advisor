/**
 * Meal plan data organized by goal type
 * Each plan includes breakfast, lunch, dinner with nutritional info
 */

const mealPlans = {
  lose: {
    breakfast: {
      name: "Greek Yogurt Parfait",
      description: "Low-fat Greek yogurt layered with mixed berries, chia seeds, and a drizzle of honey",
      calories: 350,
      protein: 25,
      carbs: 40,
      fat: 10,
      items: ["Greek yogurt (200g)", "Mixed berries (100g)", "Chia seeds (15g)", "Honey (10g)", "Granola (20g)"],
      emoji: "🥣",
    },
    lunch: {
      name: "Grilled Chicken Salad",
      description: "Grilled chicken breast on a bed of mixed greens with cherry tomatoes, cucumber, and balsamic vinaigrette",
      calories: 480,
      protein: 42,
      carbs: 25,
      fat: 22,
      items: ["Chicken breast (150g)", "Mixed greens (100g)", "Cherry tomatoes (80g)", "Cucumber (60g)", "Olive oil dressing (15ml)"],
      emoji: "🥗",
    },
    dinner: {
      name: "Baked Salmon with Vegetables",
      description: "Oven-baked salmon fillet with steamed broccoli, asparagus, and sweet potato",
      calories: 520,
      protein: 38,
      carbs: 35,
      fat: 24,
      items: ["Salmon fillet (150g)", "Broccoli (100g)", "Asparagus (80g)", "Sweet potato (100g)", "Lemon & herbs"],
      emoji: "🐟",
    },
    snack: {
      name: "Apple & Almond Butter",
      description: "Fresh apple slices with natural almond butter",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 10,
      items: ["Apple (1 medium)", "Almond butter (20g)"],
      emoji: "🍎",
    },
  },
  gain: {
    breakfast: {
      name: "Power Oatmeal Bowl",
      description: "Hearty oatmeal with banana, peanut butter, whey protein, and mixed nuts",
      calories: 650,
      protein: 35,
      carbs: 75,
      fat: 24,
      items: ["Oatmeal (80g)", "Banana (1 large)", "Peanut butter (30g)", "Whey protein (25g)", "Mixed nuts (20g)", "Milk (200ml)"],
      emoji: "🥣",
    },
    lunch: {
      name: "Chicken Rice Power Bowl",
      description: "Double portion of grilled chicken with brown rice, avocado, black beans, and corn",
      calories: 750,
      protein: 55,
      carbs: 80,
      fat: 22,
      items: ["Chicken breast (200g)", "Brown rice (150g)", "Avocado (half)", "Black beans (80g)", "Corn (50g)", "Salsa"],
      emoji: "🍗",
    },
    dinner: {
      name: "Beef Stir-Fry with Noodles",
      description: "Tender beef strips stir-fried with vegetables and egg noodles in teriyaki sauce",
      calories: 700,
      protein: 45,
      carbs: 70,
      fat: 25,
      items: ["Beef strips (180g)", "Egg noodles (120g)", "Bell peppers (80g)", "Broccoli (60g)", "Teriyaki sauce (30ml)"],
      emoji: "🥩",
    },
    snack: {
      name: "Protein Shake & Trail Mix",
      description: "Chocolate protein shake with a handful of trail mix",
      calories: 400,
      protein: 35,
      carbs: 40,
      fat: 15,
      items: ["Protein powder (30g)", "Milk (300ml)", "Trail mix (40g)"],
      emoji: "🥤",
    },
  },
  maintain: {
    breakfast: {
      name: "Avocado Toast & Eggs",
      description: "Whole grain toast with smashed avocado, poached eggs, and cherry tomatoes",
      calories: 450,
      protein: 22,
      carbs: 40,
      fat: 22,
      items: ["Whole grain bread (2 slices)", "Avocado (half)", "Eggs (2)", "Cherry tomatoes (50g)", "Seeds (10g)"],
      emoji: "🥑",
    },
    lunch: {
      name: "Mediterranean Bowl",
      description: "Quinoa bowl with grilled chicken, feta cheese, olives, hummus, and fresh vegetables",
      calories: 580,
      protein: 38,
      carbs: 55,
      fat: 22,
      items: ["Quinoa (100g)", "Chicken breast (130g)", "Feta cheese (30g)", "Hummus (40g)", "Mixed vegetables (100g)"],
      emoji: "🥙",
    },
    dinner: {
      name: "Grilled Fish Tacos",
      description: "Grilled white fish in corn tortillas with mango salsa, cabbage slaw, and lime crema",
      calories: 520,
      protein: 35,
      carbs: 50,
      fat: 18,
      items: ["White fish (150g)", "Corn tortillas (3)", "Mango salsa (60g)", "Cabbage slaw (50g)", "Lime crema (20g)"],
      emoji: "🌮",
    },
    snack: {
      name: "Mixed Nuts & Dark Chocolate",
      description: "A balanced mix of almonds, walnuts, and dark chocolate pieces",
      calories: 250,
      protein: 8,
      carbs: 20,
      fat: 18,
      items: ["Mixed nuts (30g)", "Dark chocolate (20g)"],
      emoji: "🍫",
    },
  },
};

export function getMealPlan(goal) {
  return mealPlans[goal] || mealPlans.maintain;
}

export function getTotalCalories(mealPlan) {
  return Object.values(mealPlan).reduce((sum, meal) => sum + meal.calories, 0);
}
