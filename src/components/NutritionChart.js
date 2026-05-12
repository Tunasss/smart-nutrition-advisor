"use client";

import { useEffect, useRef } from "react";
import { PieChart } from "lucide-react";

export default function NutritionChart({ macros }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!macros || !canvasRef.current) return;

    const initChart = async () => {
      const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = await import("chart.js");
      Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

      // Destroy existing chart if any to avoid Canvas already in use error
      if (chartRef.current) {
        chartRef.current.destroy();
      } else {
        const existingChart = Chart.getChart(canvasRef.current);
        if (existingChart) existingChart.destroy();
      }

      const ctx = canvasRef.current.getContext("2d");

      chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Protein", "Carbs", "Fat"],
          datasets: [
            {
              data: [macros.protein.percentage, macros.carbs.percentage, macros.fat.percentage],
              backgroundColor: [
                "rgba(59, 130, 246, 0.85)",
                "rgba(245, 158, 11, 0.85)",
                "rgba(244, 63, 94, 0.85)",
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(244, 63, 94, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 8,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              titleFont: { family: "Inter", size: 13, weight: "600" },
              bodyFont: { family: "Inter", size: 12 },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
              },
            },
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: "easeOutQuart",
          },
        },
      });
    };

    initChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [macros]);

  if (!macros) return null;

  const macroItems = [
    { label: "Protein", grams: macros.protein.grams, pct: macros.protein.percentage, color: "bg-blue-500", textColor: "text-blue-600" },
    { label: "Carbs", grams: macros.carbs.grams, pct: macros.carbs.percentage, color: "bg-amber-500", textColor: "text-amber-600" },
    { label: "Fat", grams: macros.fat.grams, pct: macros.fat.percentage, color: "bg-rose-500", textColor: "text-rose-600" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 animate-slide-up stagger-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <PieChart className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Macro Breakdown</h2>
          <p className="text-sm text-gray-500">Your daily macronutrient distribution</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Chart */}
        <div className="w-48 h-48 relative shrink-0">
          <canvas ref={canvasRef} />
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4 w-full">
          {macroItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${item.color} shrink-0`} />
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className={`text-sm font-bold ${item.textColor}`}>
                    {item.grams}g ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
