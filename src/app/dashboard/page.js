"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BMICard from "@/components/BMICard";
import CaloriesCard from "@/components/CaloriesCard";
import MealPlanTable from "@/components/MealPlanTable";
import NutritionChart from "@/components/NutritionChart";
import { ArrowLeft, User, Ruler, Weight, Calendar, Sparkles, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, result, clearResult, history, setResult, user } = useApp();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (result) {
      setShowDetails(true);
    }
  }, [result]);

  if (!isAuthenticated) return null;

  const handleNewCalculation = () => {
    clearResult();
    setShowDetails(false);
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
                {result && showDetails && (
                  result.isAI ? (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-3 animate-fade-in">
                      <Sparkles className="w-4 h-4" />
                      AI Analysis Complete
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-sm font-medium text-amber-700 mb-3 animate-fade-in">
                      <AlertCircle className="w-4 h-4" />
                      Formula-based Fallback (AI Offline)
                    </div>
                  )
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {user?.name ? `${user.name}'s Nutrition Dashboard` : "Your Nutrition Dashboard"}
                </h1>
                {!(result && showDetails) && (
                  <p className="text-gray-500 mt-1.5 text-sm">
                    Chọn một kết quả tính toán bên dưới để xem chi tiết thực đơn và phân tích dinh dưỡng.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {result && showDetails && (
                  <button
                     onClick={() => setShowDetails(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Close Details
                  </button>
                )}
                <button
                  onClick={handleNewCalculation}
                  id="new-calculation-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Calculation
                </button>
              </div>
            </div>

            {/* User Info Bar */}
            {result && showDetails && (
              <div className="mt-4 flex flex-wrap items-center gap-3 animate-fade-in">
                {[
                  { icon: Calendar, label: `${result.userInfo.age} years` },
                  { icon: Weight, label: `${result.userInfo.weight} kg` },
                  { icon: Ruler, label: `${result.userInfo.height} cm` },
                  { icon: User, label: result.userInfo.goal },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm"
                  >
                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BMI + Calories Cards + Meal Plan + Nutrition Chart (Only show if result is set and showDetails is true) */}
          {result && showDetails ? (
            <div className="space-y-8 animate-fade-in mb-8">
              {result.isAI === false && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Gemini AI Offline Fallback</span>
                    We couldn&apos;t connect to the Gemini AI API. Your personalized plan has been generated using standard formula-based estimation (Mifflin-St Jeor) and pre-configured meal plans.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BMICard bmi={result.bmi} bmiCategory={result.bmiCategory} />
                <CaloriesCard
                  calories={result.calories}
                  goal={result.userInfo.goal}
                  macros={result.macros}
                />
              </div>

              {/* Meal Plan */}
              <MealPlanTable mealPlan={result.mealPlan} />

              {/* Nutrition Chart */}
              <NutritionChart macros={result.macros} />
              
              {/* Bottom CTA */}
              <div className="text-center py-4">
                <button
                  onClick={handleNewCalculation}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Calculate Again
                </button>
              </div>
            </div>
          ) : null}

          {/* Calculation History */}
          <div suppressHydrationWarning={true} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Calculation History</h2>
            </div>

            {history && history.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto pr-2">
                {history.map((entry) => {
                  const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  // Determine if this entry is the one currently active
                  const isCurrent = result &&
                    result.userInfo &&
                    result.calories === entry.result?.calories &&
                    result.userInfo.weight === entry.weight &&
                    result.userInfo.height === entry.height &&
                    result.userInfo.age === entry.age &&
                    result.userInfo.targetWeight === entry.targetWeight &&
                    result.userInfo.timeframe === entry.timeframe;

                  return (
                    <div
                      key={entry.id}
                      onClick={() => {
                        if (entry.result) {
                          setResult(entry.result);
                          setShowDetails(true);
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md
                        ${isCurrent
                          ? "border-primary-500 bg-primary-50/30 ring-1 ring-primary-500"
                          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                        }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-gray-400">{date}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm capitalize">
                          Goal: {entry.goal}
                        </h3>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-500">
                          <div>
                            <span className="block text-[10px] uppercase text-gray-400">Weight</span>
                            <span className="font-medium text-gray-700">{entry.weight} kg</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-gray-400">Height</span>
                            <span className="font-medium text-gray-700">{entry.height} cm</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase text-gray-400">Age</span>
                            <span className="font-medium text-gray-700">{entry.age} yrs</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end text-xs font-semibold text-primary-600">
                        View Plan &rarr;
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 bg-gray-50/20 rounded-xl border border-dashed border-gray-200 min-h-[150px]" />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

