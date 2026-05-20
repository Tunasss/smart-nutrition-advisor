import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMealPlan } from "@/lib/mealPlans";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function generateMealPlan({ goal, calories, macros }) {
    const aiMetadata = { provider: "google-gemini", fallback: false };
    let mealPlan = null;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        const prompt = `
        Meal plan.
        Goal: ${goal}
        Calories: ${calories}
        Protein ${macros.protein.grams}g
        Carbs ${macros.carbs.grams}g
        Fat ${macros.fat.grams}g
        
        JSON only:
        {
          "breakfast": { "name": "", "description": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "items": ["", ""] },
          "lunch": { "name": "", "description": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "items": ["", ""] },
          "dinner": { "name": "", "description": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "items": ["", ""] },
          "snack": { "name": "", "description": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "items": ["", ""] }
        }`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const result = await model.generateContent(
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                    responseMimeType: "application/json",
                },
            },
            {
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);
        mealPlan = JSON.parse(result.response.text());

    } catch (aiError) {
        console.warn("[Gemini Generation Failed] Using fallback.", aiError.message);

        const fallbackPlan = getMealPlan(goal);
        const getMacro = (macro, ratio) => Math.round(macro * ratio);

        mealPlan = {
            breakfast: {
                name: fallbackPlan.breakfast?.name,
                description: fallbackPlan.breakfast?.description || "",
                calories: fallbackPlan.breakfast?.calories || getMacro(calories, 0.25),
                protein: fallbackPlan.breakfast?.protein || getMacro(macros.protein.grams, 0.25),
                carbs: fallbackPlan.breakfast?.carbs || getMacro(macros.carbs.grams, 0.25),
                fat: fallbackPlan.breakfast?.fat || getMacro(macros.fat.grams, 0.25),
                items: fallbackPlan.breakfast?.items || [],
            },
            lunch: {
                name: fallbackPlan.lunch?.name,
                description: fallbackPlan.lunch?.description || "",
                calories: fallbackPlan.lunch?.calories || getMacro(calories, 0.35),
                protein: fallbackPlan.lunch?.protein || getMacro(macros.protein.grams, 0.35),
                carbs: fallbackPlan.lunch?.carbs || getMacro(macros.carbs.grams, 0.35),
                fat: fallbackPlan.lunch?.fat || getMacro(macros.fat.grams, 0.35),
                items: fallbackPlan.lunch?.items || [],
            },
            dinner: {
                name: fallbackPlan.dinner?.name,
                description: fallbackPlan.dinner?.description || "",
                calories: fallbackPlan.dinner?.calories || getMacro(calories, 0.30),
                protein: fallbackPlan.dinner?.protein || getMacro(macros.protein.grams, 0.30),
                carbs: fallbackPlan.dinner?.carbs || getMacro(macros.carbs.grams, 0.30),
                fat: fallbackPlan.dinner?.fat || getMacro(macros.fat.grams, 0.30),
                items: fallbackPlan.dinner?.items || [],
            },
            snack: {
                name: fallbackPlan.snack?.name,
                description: fallbackPlan.snack?.description || "",
                calories: fallbackPlan.snack?.calories || getMacro(calories, 0.10),
                protein: fallbackPlan.snack?.protein || getMacro(macros.protein.grams, 0.10),
                carbs: fallbackPlan.snack?.carbs || getMacro(macros.carbs.grams, 0.10),
                fat: fallbackPlan.snack?.fat || getMacro(macros.fat.grams, 0.10),
                items: fallbackPlan.snack?.items || [],
            },
        };

        aiMetadata.fallback = true;
    }

    return { mealPlan, aiMetadata };
}