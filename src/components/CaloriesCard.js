"use client";

import { Flame, TrendingDown, TrendingUp, Minus } from "lucide-react";

const goalConfig = {
  "Lose Weight": { icon: TrendingDown, text: "Calorie deficit for weight loss", color: "text-blue-600" },
  "Gain Weight": { icon: TrendingUp, text: "Calorie surplus for muscle gain", color: "text-amber-600" },
  "Maintain Weight": { icon: Minus, text: "Balanced intake for maintenance", color: "text-primary-600" },
};

export default function CaloriesCard({ calories, goal, macros }) {
  const config = goalConfig[goal] || goalConfig["Maintain Weight"];
  const GoalIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up stagger-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Daily Calories</h3>
        </div>
        <GoalIcon className={`w-5 h-5 ${config.color}`} />
      </div>

      <div className="mb-2">
        <span className="text-5xl font-extrabold text-gray-900">
          {calories.toLocaleString("en-US")}
        </span>
        <span className="text-lg text-gray-400 ml-1">kcal/day</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{config.text}</p>

      {/* Macro Breakdown Mini */}
      {macros && (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Protein</p>
            <p className="text-sm font-bold text-blue-700">{macros.protein.grams}g</p>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-600 font-medium">Carbs</p>
            <p className="text-sm font-bold text-amber-700">{macros.carbs.grams}g</p>
          </div>
          <div className="text-center p-2 bg-rose-50 rounded-lg">
            <p className="text-xs text-rose-600 font-medium">Fat</p>
            <p className="text-sm font-bold text-rose-700">{macros.fat.grams}g</p>
          </div>
        </div>
      )}
    </div>
  );
}
