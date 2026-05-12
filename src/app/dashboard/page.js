"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BMICard from "@/components/BMICard";
import CaloriesCard from "@/components/CaloriesCard";
import MealPlanTable from "@/components/MealPlanTable";
import NutritionChart from "@/components/NutritionChart";
import { ArrowLeft, User, Ruler, Weight, Calendar, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, result, clearResult } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    if (!result) {
      router.push("/input");
    }
  }, [isAuthenticated, result, router]);

  if (!isAuthenticated || !result) return null;

  const handleNewCalculation = () => {
    clearResult();
    router.push("/input");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-3">
                  <Sparkles className="w-4 h-4" />
                  AI Analysis Complete
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Your Nutrition Dashboard
                </h1>
              </div>
              <button
                onClick={handleNewCalculation}
                id="new-calculation-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                New Calculation
              </button>
            </div>

            {/* User Info Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {[
                { icon: Calendar, label: `${result.userInfo.age} years` },
                { icon: Weight, label: `${result.userInfo.weight} kg` },
                { icon: Ruler, label: `${result.userInfo.height} cm` },
                { icon: User, label: result.userInfo.goal },
              ].map((item, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                >
                  <item.icon className="w-3.5 h-3.5 text-gray-400" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* BMI + Calories Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <BMICard bmi={result.bmi} bmiCategory={result.bmiCategory} />
            <CaloriesCard
              calories={result.calories}
              goal={result.userInfo.goal}
              macros={result.macros}
            />
          </div>

          {/* Meal Plan */}
          <div className="mb-8">
            <MealPlanTable mealPlan={result.mealPlan} />
          </div>

          {/* Nutrition Chart */}
          <div className="mb-8">
            <NutritionChart macros={result.macros} />
          </div>

          {/* Bottom CTA */}
          <div className="text-center pb-4 animate-fade-in">
            <button
              onClick={handleNewCalculation}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Calculate Again
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
