/**
 * Google Gemini API integration helper
 */
export async function generateAIEstimate({ ageNum, weightNum, heightNum, goal, targetWeightNum, timeframeNum }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in environment variables.");
    return null;
  }

  const goalLabels = {
    lose: "Lose Weight",
    gain: "Gain Weight",
    maintain: "Maintain Weight",
  };

  try {
    const mealThemes = [
      "traditional Vietnamese home-cooked style (cơm nhà thanh đạm)",
      "healthy modern Vietnamese fusion style",
      "easy-to-prepare simple local meals",
      "nutritious traditional Northern/Central/Southern Vietnamese dishes",
      "creative local healthy choices",
    ];
    const randomTheme = mealThemes[Math.floor(Math.random() * mealThemes.length)];
    const randomSeed = Math.random().toString(36).substring(2, 9);

    const prompt = `You are an expert nutrition advisor. Create a personalized, realistic nutrition plan and a daily meal plan based on the user's profile:
Age: ${ageNum}
Weight: ${weightNum} kg
Height: ${heightNum} cm
Goal: ${goalLabels[goal] || goal}
Target Weight: ${targetWeightNum || "N/A"} kg
Timeframe: ${timeframeNum || "N/A"} weeks

You must return:
1. Precise BMI based on the weight and height (weight / (height/100)^2).
2. The correct BMI Category (Underweight: <18.5, Normal: 18.5-24.9, Overweight: 25.0-29.9, Obese: >=30) and a color representation (#3b82f6 for Underweight, #10b981 for Normal, #f59e0b for Overweight, #ef4444 for Obese).
3. The recommended daily calorie target (TDEE adjusted for goal).
4. The daily macronutrient targets: protein, carbs, and fat in grams (ensure they align with the calorie target: 1g protein = 4 kcal, 1g carb = 4 kcal, 1g fat = 9 kcal).
5. A highly customized, tasty Vietnamese or international meal plan consisting of breakfast, lunch, dinner, and a snack.
- The meals should be realistic, delicious, and aligned with the user's goal.
- Focus on this specific culinary theme for variety: ${randomTheme}.
- IMPORTANT: To prevent repetitive suggestions (like always suggesting basic boiled chicken breast), use this variance seed: "${randomSeed}" to inspire unique, creative, and diverse dish choices. Avoid selecting the exact same dishes in consecutive runs.
- Make sure that the sum of calories and macros of the individual meals (breakfast + lunch + dinner + snack) matches the daily calorie and macronutrient targets as closely as possible.
- Provide clear names, descriptive ingredients, exact nutrition values per meal, a bulleted list of preparation ingredients or items, and a single suitable emoji for each meal.
- IMPORTANT: Keep each meal's description extremely concise (maximum 1 sentence, under 15 words) and limit the items list to a maximum of 4 essential entries to speed up response time.`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        bmi: { type: "NUMBER" },
        bmiCategory: {
          type: "OBJECT",
          properties: {
            label: { type: "STRING" },
            color: { type: "STRING" }
          },
          required: ["label", "color"]
        },
        calories: { type: "INTEGER" },
        macros: {
          type: "OBJECT",
          properties: {
            protein: { type: "INTEGER" },
            carbs: { type: "INTEGER" },
            fat: { type: "INTEGER" }
          },
          required: ["protein", "carbs", "fat"]
        },
        mealPlan: {
          type: "OBJECT",
          properties: {
            breakfast: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                description: { type: "STRING" },
                calories: { type: "INTEGER" },
                protein: { type: "INTEGER" },
                carbs: { type: "INTEGER" },
                fat: { type: "INTEGER" },
                items: { type: "ARRAY", items: { type: "STRING" } },
                emoji: { type: "STRING" }
              },
              required: ["name", "description", "calories", "protein", "carbs", "fat", "items", "emoji"]
            },
            lunch: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                description: { type: "STRING" },
                calories: { type: "INTEGER" },
                protein: { type: "INTEGER" },
                carbs: { type: "INTEGER" },
                fat: { type: "INTEGER" },
                items: { type: "ARRAY", items: { type: "STRING" } },
                emoji: { type: "STRING" }
              },
              required: ["name", "description", "calories", "protein", "carbs", "fat", "items", "emoji"]
            },
            dinner: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                description: { type: "STRING" },
                calories: { type: "INTEGER" },
                protein: { type: "INTEGER" },
                carbs: { type: "INTEGER" },
                fat: { type: "INTEGER" },
                items: { type: "ARRAY", items: { type: "STRING" } },
                emoji: { type: "STRING" }
              },
              required: ["name", "description", "calories", "protein", "carbs", "fat", "items", "emoji"]
            },
            snack: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                description: { type: "STRING" },
                calories: { type: "INTEGER" },
                protein: { type: "INTEGER" },
                carbs: { type: "INTEGER" },
                fat: { type: "INTEGER" },
                items: { type: "ARRAY", items: { type: "STRING" } },
                emoji: { type: "STRING" }
              },
              required: ["name", "description", "calories", "protein", "carbs", "fat", "items", "emoji"]
            }
          },
          required: ["breakfast", "lunch", "dinner", "snack"]
        }
      },
      required: ["bmi", "bmiCategory", "calories", "macros", "mealPlan"]
    };

    let response = null;
    let lastError = null;
    const models = [
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite-preview",
      "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];

    for (const model of models) {
      try {
        const apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 1.0,
              },
            }),
          }
        );

        if (apiResponse.ok) {
          response = apiResponse;
          console.log(`Successfully generated nutrition data using model: ${model}`);
          break;
        } else {
          const errText = await apiResponse.text();
          console.warn(`Model ${model} failed (Status ${apiResponse.status}): ${errText}`);
          lastError = new Error(`API error status ${apiResponse.status}: ${errText}`);
        }
      } catch (fetchErr) {
        console.warn(`Failed fetch request for model ${model}:`, fetchErr);
        lastError = fetchErr;
      }
    }

    if (!response) {
      throw lastError || new Error("All Gemini models failed to respond");
    }

    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini API");
    }

    const aiResult = JSON.parse(jsonText);

    // Structure and format macros to match the client expectation: { grams, percentage }
    const pGrams = typeof aiResult.macros?.protein === "number" ? aiResult.macros.protein : (aiResult.macros?.protein?.grams || 0);
    const cGrams = typeof aiResult.macros?.carbs === "number" ? aiResult.macros.carbs : (aiResult.macros?.carbs?.grams || 0);
    const fGrams = typeof aiResult.macros?.fat === "number" ? aiResult.macros.fat : (aiResult.macros?.fat?.grams || 0);

    const totalKcal = (pGrams * 4) + (cGrams * 4) + (fGrams * 9);
    const pPct = totalKcal > 0 ? Math.round(((pGrams * 4) / totalKcal) * 100) : 30;
    const cPct = totalKcal > 0 ? Math.round(((cGrams * 4) / totalKcal) * 100) : 40;
    const fPct = totalKcal > 0 ? 100 - pPct - cPct : 30;

    const formattedMacros = {
      protein: { grams: pGrams, percentage: pPct },
      carbs: { grams: cGrams, percentage: cPct },
      fat: { grams: fGrams, percentage: fPct }
    };

    return {
      ...aiResult,
      macros: formattedMacros,
    };
  } catch (error) {
    console.error("Failed to generate nutrition with Gemini API:", error);
    return null;
  }
}
