import { NextResponse } from "next/server";
import { calculateBMI, getBMICategory, calculateTDEE, calculateMacros } from "@/lib/nutrition";
import { getMealPlan } from "@/lib/mealPlans";
import { db } from "@/lib/db";
import { generateAIEstimate } from "@/lib/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const { age, weight, height, goal, targetWeight, timeframe, email } = body;

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

    const goalLabels = {
      lose: "Lose Weight",
      gain: "Gain Weight",
      maintain: "Maintain Weight",
    };

    let result = null;

    // Check history cache to return immediately if user requests calculation with identical metrics
    if (email) {
      try {
        const userHistory = await db.getHistory(email);
        const match = userHistory.find(
          (entry) =>
            entry.age === ageNum &&
            entry.weight === weightNum &&
            entry.height === heightNum &&
            entry.goal === (goalLabels[goal] || goal) &&
            entry.targetWeight === targetWeightNum &&
            entry.timeframe === timeframeNum
        );
        if (match && match.result) {
          console.log("Returning cached duplicate nutrition calculation");
          return NextResponse.json(match.result);
        }
      } catch (cacheError) {
        console.error("Failed to read user calculation cache:", cacheError);
      }
    }

    try {
      const aiResponse = await generateAIEstimate({
        ageNum,
        weightNum,
        heightNum,
        goal,
        targetWeightNum,
        timeframeNum,
      });

      if (aiResponse) {
        result = {
          ...aiResponse,
          isAI: true,
          userInfo: {
            age: ageNum,
            weight: weightNum,
            height: heightNum,
            goal: goalLabels[goal] || goal,
            targetWeight: targetWeightNum,
            timeframe: timeframeNum,
          },
        };
      }
    } catch (aiError) {
      console.error("Failed to generate AI estimate:", aiError);
    }

    // Fallback: If result is not generated (no API key or API call failed)
    if (!result) {
      console.log("Using formula-based fallback calculations");
      const bmi = calculateBMI(weightNum, heightNum);
      const bmiCategory = getBMICategory(bmi);
      const calories = calculateTDEE(weightNum, heightNum, ageNum, goal, targetWeightNum, timeframeNum);
      const macros = calculateMacros(calories, goal);
      const mealPlan = getMealPlan(goal);

      result = {
        bmi,
        bmiCategory,
        calories,
        macros,
        mealPlan,
        isAI: false,
        userInfo: {
          age: ageNum,
          weight: weightNum,
          height: heightNum,
          goal: goalLabels[goal] || goal,
          targetWeight: targetWeightNum,
          timeframe: timeframeNum,
        },
      };
    }

    // Save to user history if email is provided (user is logged in)
    if (email) {
      try {
        await db.addHistoryEntry(email, {
          age: ageNum,
          weight: weightNum,
          height: heightNum,
          goal: goalLabels[goal] || goal,
          targetWeight: targetWeightNum,
          timeframe: timeframeNum,
          result,
        });
      } catch (dbError) {
        console.error("Failed to save history entry in db:", dbError);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in nutrition calculation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

