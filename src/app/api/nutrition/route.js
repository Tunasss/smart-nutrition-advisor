import { NextResponse } from "next/server";
import { calculateBMI, getBMICategory, calculateTDEE, calculateMacros } from "@/lib/nutrition";
import {generateMealPlan} from "@/lib/gemini";

const ALLOWED_GOALS = ["lose", "gain", "maintain"];

export async function POST(request) {
  try {
    const body = await request.json();
    const { age, weight, height, goal, targetWeight, timeframe } = body;

    // Validate inputs
    if (!age || !weight || !height || !goal) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!ALLOWED_GOALS.includes( goal )) {
      return NextResponse.json(
          {error: "Goal is required"},
          {status: 400}
      );
    }

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const targetWeightNum = targetWeight ? Number(targetWeight) : null;
    const timeframeNum = timeframe ? Number(timeframe) : null;

    if (
        !Number.isFinite(ageNum) ||
        !Number.isFinite(weightNum) ||
        !Number.isFinite(heightNum)
    ) {
      return NextResponse.json({ error: "Invalid numeric input" }, { status: 400 });
    }
    if (ageNum < 1 || ageNum > 120) {
      return NextResponse.json({ error: "Age must be between 1 and 120" }, { status: 400 });
    }
    if (weightNum < 20 || weightNum > 300) {
      return NextResponse.json({ error: "Weight must be between 20 and 300 kg" }, { status: 400 });
    }
    if (heightNum < 50 || heightNum > 250) {
      return NextResponse.json({ error: "Height must be between 50 and 250 cm" }, { status: 400 });
    }
    if (targetWeightNum !== null) {
      if (!Number.isFinite(targetWeightNum) || targetWeightNum < 20 || targetWeightNum > 300) {
        return NextResponse.json({ error: "Invalid target weight" }, { status: 400 });
      }
    }

    if (timeframeNum !== null) {
      if (!Number.isFinite(timeframeNum) || timeframeNum < 1 || timeframeNum > 104) {
        return NextResponse.json({ error: "Invalid timeframe (must be 1 to 104 weeks)" }, { status: 400 });
      }
    }

    // Calculate results
    const bmi = calculateBMI(weightNum, heightNum);
    const bmiCategory = getBMICategory(bmi);
    const calories = calculateTDEE(weightNum, heightNum, ageNum, goal, targetWeightNum, timeframeNum);
    const macros = calculateMacros(calories, goal);

    const { mealPlan, aiMetadata } = await generateMealPlan({ goal, calories, macros})

    return NextResponse.json({
      bmi,
      bmiCategory,
      calories,
      macros,
      mealPlan,
      userInfo: {
        age: ageNum,
        weight: weightNum,
        height: heightNum,
        goal,
        targetWeight: targetWeightNum,
        timeframe: timeframeNum,
      },
    });
  } catch (error) {
    console.error("[Fatal API]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
