import { NextResponse } from "next/server";
import { calculateBMI, getBMICategory, calculateTDEE, calculateMacros } from "@/lib/nutrition";
import { getMealPlan } from "@/lib/mealPlans";

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

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const targetWeightNum = targetWeight ? parseFloat(targetWeight) : null;
    const timeframeNum = timeframe ? parseInt(timeframe) : null;

    if (ageNum < 1 || ageNum > 120) {
      return NextResponse.json({ error: "Age must be between 1 and 120" }, { status: 400 });
    }
    if (weightNum < 20 || weightNum > 300) {
      return NextResponse.json({ error: "Weight must be between 20 and 300 kg" }, { status: 400 });
    }
    if (heightNum < 50 || heightNum > 250) {
      return NextResponse.json({ error: "Height must be between 50 and 250 cm" }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Calculate results
    const bmi = calculateBMI(weightNum, heightNum);
    const bmiCategory = getBMICategory(bmi);
    const calories = calculateTDEE(weightNum, heightNum, ageNum, goal, targetWeightNum, timeframeNum);
    const macros = calculateMacros(calories, goal);
    const mealPlan = getMealPlan(goal);

    const goalLabels = {
      lose: "Lose Weight",
      gain: "Gain Weight",
      maintain: "Maintain Weight",
    };

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
        goal: goalLabels[goal] || goal,
        targetWeight: targetWeightNum,
        timeframe: timeframeNum,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
