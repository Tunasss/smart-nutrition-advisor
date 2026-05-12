"use client";

import { Utensils, Clock } from "lucide-react";

const mealTimes = {
  breakfast: { label: "Breakfast", time: "7:00 - 8:00 AM", gradient: "from-amber-400 to-orange-500" },
  lunch: { label: "Lunch", time: "12:00 - 1:00 PM", gradient: "from-primary-400 to-primary-600" },
  dinner: { label: "Dinner", time: "6:00 - 7:00 PM", gradient: "from-indigo-400 to-purple-500" },
  snack: { label: "Snack", time: "3:00 - 4:00 PM", gradient: "from-pink-400 to-rose-500" },
};

export default function MealPlanTable({ mealPlan }) {
  if (!mealPlan) return null;

  const meals = Object.entries(mealPlan);

  return (
    <div className="animate-slide-up stagger-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Utensils className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Daily Meal Plan</h2>
          <p className="text-sm text-gray-500">Personalized meals for your goal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meals.map(([key, meal], index) => {
          const mealTime = mealTimes[key] || mealTimes.snack;
          return (
            <div
              key={key}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              {/* Meal Header */}
              <div className={`bg-gradient-to-r ${mealTime.gradient} p-4 text-white`}>
                <div className="text-3xl mb-1">{meal.emoji}</div>
                <h3 className="font-bold text-lg">{mealTime.label}</h3>
                <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                  <Clock className="w-3 h-3" />
                  {mealTime.time}
                </div>
              </div>

              {/* Meal Content */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{meal.name}</h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{meal.description}</p>

                {/* Calories Badge */}
                <div className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold mb-3">
                  🔥 {meal.calories} kcal
                </div>

                {/* Food Items */}
                <ul className="space-y-1">
                  {meal.items.map((item, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-primary-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Macros Mini Bar */}
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400">Protein</p>
                    <p className="text-xs font-bold text-gray-700">{meal.protein}g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Carbs</p>
                    <p className="text-xs font-bold text-gray-700">{meal.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Fat</p>
                    <p className="text-xs font-bold text-gray-700">{meal.fat}g</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
