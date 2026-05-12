"use client";

import { Activity } from "lucide-react";
import { getBMIPercentage } from "@/lib/nutrition";

export default function BMICard({ bmi, bmiCategory }) {
  const percentage = getBMIPercentage(bmi);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up stagger-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Your BMI</h3>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: bmiCategory.bg, color: bmiCategory.color }}
        >
          {bmiCategory.label}
        </div>
      </div>

      <div className="mb-4">
        <span
          className="text-5xl font-extrabold"
          style={{ color: bmiCategory.color }}
        >
          {bmi}
        </span>
        <span className="text-lg text-gray-400 ml-1">kg/m²</span>
      </div>

      {/* BMI Scale Bar */}
      <div className="relative">
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
          <div className="w-[25%] bg-blue-400 rounded-l-full" />
          <div className="w-[25%] bg-green-400" />
          <div className="w-[25%] bg-amber-400" />
          <div className="w-[25%] bg-red-400 rounded-r-full" />
        </div>
        {/* Indicator */}
        <div
          className="absolute top-[-4px] w-5 h-5 bg-white border-3 rounded-full shadow-md transition-all duration-700 ease-out"
          style={{
            left: `calc(${percentage}% - 10px)`,
            borderColor: bmiCategory.color,
            borderWidth: "3px",
          }}
        />
        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>
    </div>
  );
}
