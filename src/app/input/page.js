"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar, Weight, Ruler, Target, ArrowRight, ArrowLeft, Loader2,
  TrendingDown, TrendingUp, Minus, AlertCircle, Activity
} from "lucide-react";
import { calculateBMI, getBMICategory } from "@/lib/nutrition";

const goals = [
  { id: "lose", label: "Lose Weight", description: "Calorie deficit plan", icon: TrendingDown, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", activeBg: "bg-blue-100" },
  { id: "maintain", label: "Maintain", description: "Balanced nutrition", icon: Minus, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200", activeBg: "bg-primary-100" },
  { id: "gain", label: "Gain Weight", description: "Calorie surplus plan", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", activeBg: "bg-amber-100" },
];

export default function InputPage() {
  const router = useRouter();
  const { isAuthenticated, formData, updateFormData, calculateNutrition, isLoading, error, user } = useApp();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [localBmi, setLocalBmi] = useState(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let progressInterval;
    let messageInterval;
    const messages = [
      "Connecting to Gemini AI...",
      "Analyzing your body metrics (BMI & TDEE)...",
      "Structuring daily macronutrient distribution...",
      "Crafting customized meal recommendations...",
      "Matching calorie targets to meal plans...",
      "Almost there! Generating your dashboard...",
    ];

    if (isLoading) {
      setLoadingProgress(0);
      setLoadingMessage(messages[0]);
      
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) {
            return 98;
          }
          // Smooth asymptotic decay: slows down naturally as it approaches 98%
          const remaining = 98 - prev;
          const step = Math.max(0.08, remaining * 0.04);
          return parseFloat((prev + step).toFixed(2));
        });
      }, 100);

      let msgIndex = 0;
      messageInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setLoadingMessage(messages[msgIndex]);
      }, 1500);
    } else {
      setLoadingProgress(0);
      setLoadingMessage("");
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  if (!isAuthenticated) return null;

  const validateField = (field, value) => {
    switch (field) {
      case "age":
        if (!value) return "Age is required";
        if (value < 1 || value > 120) return "Age must be 1-120";
        return null;
      case "weight":
        if (!value) return "Weight is required";
        if (value < 20 || value > 300) return "Weight must be 20-300 kg";
        return null;
      case "height":
        if (!value) return "Height is required";
        if (value < 50 || value > 250) return "Height must be 50-250 cm";
        return null;
      case "targetWeight":
        if (formData.goal === "maintain") return null;
        if (!value) return "Target weight is required";
        if (value < 20 || value > 300) return "Must be 20-300 kg";
        if (formData.goal === "lose" && formData.weight && parseFloat(value) >= parseFloat(formData.weight)) return "Must be less than current weight";
        if (formData.goal === "gain" && formData.weight && parseFloat(value) <= parseFloat(formData.weight)) return "Must be greater than current weight";
        return null;
      case "timeframe":
        if (formData.goal === "maintain") return null;
        if (!value) return "Timeframe is required";
        if (value < 1 || value > 104) return "Must be 1-104 weeks";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field, value) => {
    updateFormData(field, value);
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    ["age", "weight", "height"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    setTouched({ age: true, weight: true, height: true });
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const fieldsToValidate = [];
    if (formData.goal !== "maintain") {
      fieldsToValidate.push("targetWeight", "timeframe");
    }
    
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    
    const newTouched = {};
    if (formData.goal !== "maintain") {
      newTouched.targetWeight = true;
      newTouched.timeframe = true;
    }
    setTouched((prev) => ({ ...prev, ...newTouched }));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      // Calculate local BMI for recommendations
      const bmiVal = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));
      setLocalBmi(bmiVal);
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const result = await calculateNutrition(formData);
    if (result) {
      router.push("/dashboard");
    }
  };

  const inputFields = [
    { id: "age", label: "Age", unit: "years", icon: Calendar, placeholder: "25", min: 1, max: 120 },
    { id: "weight", label: "Weight", unit: "kg", icon: Weight, placeholder: "70", min: 20, max: 300 },
    { id: "height", label: "Height", unit: "cm", icon: Ruler, placeholder: "175", min: 50, max: 250 },
  ];

  const getBmiRecommendation = () => {
    if (!localBmi) return null;
    const cat = getBMICategory(localBmi);
    
    // Quick estimation for normal weight range (BMI 18.5 - 24.9)
    const heightM = parseFloat(formData.height) / 100;
    const minNormalWeight = (18.5 * heightM * heightM).toFixed(1);
    const maxNormalWeight = (24.9 * heightM * heightM).toFixed(1);

    return (
      <div className="bg-primary-50 rounded-xl p-5 mb-6 border border-primary-100 flex gap-4 items-start animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-primary-600">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            Your estimated BMI is <span style={{ color: cat.color }}>{localBmi} ({cat.label})</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {cat.label === "Underweight" && `Consider gaining weight to reach a healthy range (${minNormalWeight}kg - ${maxNormalWeight}kg).`}
            {cat.label === "Normal" && `You are in a healthy weight range (${minNormalWeight}kg - ${maxNormalWeight}kg). You can maintain or focus on muscle gain.`}
            {(cat.label === "Overweight" || cat.label === "Obese") && `Consider losing weight to reach a healthy range (${minNormalWeight}kg - ${maxNormalWeight}kg).`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-4 transition-all duration-300">
              <Target className="w-4 h-4" />
              Step {step} of 2
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {step === 1 
                ? (user?.name ? `Hello ${user.name}, Tell Us About Yourself` : "Tell Us About Yourself") 
                : "Set Your Goals"}
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {step === 1 
                ? "Fill in your details to get personalized AI nutrition recommendations" 
                : "Choose your objective and set a realistic timeframe"}
            </p>
          </div>

          {/* Form Card */}
          <div suppressHydrationWarning={true} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 relative overflow-hidden min-h-[400px]">
            
            {/* Step 1 Content */}
            <div className={`transition-all duration-500 absolute w-full left-0 px-6 sm:px-8 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {inputFields.map((field) => {
                    const Icon = field.icon;
                    const hasError = errors[field.id];
                    return (
                      <div key={field.id}>
                        <label htmlFor={`${field.id}-input`} className="block text-sm font-medium text-gray-700 mb-1.5">
                          {field.label}
                        </label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id={`${field.id}-input`}
                            type="number"
                            value={formData[field.id]}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            onBlur={() => handleBlur(field.id)}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            className={`w-full pl-10 pr-14 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${hasError ? "border-red-400 bg-red-50/50" : "border-gray-200"}`}
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                            {field.unit}
                          </span>
                        </div>
                        {hasError && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {hasError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    Calculate BMI & Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 Content */}
            <div className={`transition-all duration-500 w-full ${step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none absolute top-0 left-0 px-6 sm:px-8'}`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Recommendation Banner */}
                {step === 2 && getBmiRecommendation()}

                {/* Goal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What&apos;s your goal?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {goals.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = formData.goal === goal.id;
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          id={`goal-${goal.id}`}
                          onClick={() => updateFormData("goal", goal.id)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer
                            ${isSelected
                              ? `${goal.border} ${goal.activeBg} shadow-md scale-[1.02]`
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-lg ${goal.bg} flex items-center justify-center mb-2`}>
                            <Icon className={`w-5 h-5 ${goal.color}`} />
                          </div>
                          <h3 className={`font-semibold text-sm ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                            {goal.label}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{goal.description}</p>
                          {isSelected && (
                            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${goal.bg} flex items-center justify-center`}>
                              <div className={`w-2.5 h-2.5 rounded-full bg-current ${goal.color}`} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Extra fields for Lose/Gain weight */}
                {formData.goal !== "maintain" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
                    {/* Target Weight */}
                    <div>
                      <label htmlFor="targetWeight-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Target Weight
                      </label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="targetWeight-input"
                          type="number"
                          value={formData.targetWeight}
                          onChange={(e) => handleChange("targetWeight", e.target.value)}
                          onBlur={() => handleBlur("targetWeight")}
                          placeholder="e.g. 65"
                          className={`w-full pl-10 pr-14 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${errors.targetWeight ? "border-red-400 bg-red-50/50" : "border-gray-200"}`}
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                          kg
                        </span>
                      </div>
                      {errors.targetWeight && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.targetWeight}
                        </p>
                      )}
                    </div>

                    {/* Timeframe */}
                    <div>
                      <label htmlFor="timeframe-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Timeframe
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="timeframe-input"
                          type="number"
                          value={formData.timeframe}
                          onChange={(e) => handleChange("timeframe", e.target.value)}
                          onBlur={() => handleBlur("timeframe")}
                          placeholder="e.g. 12"
                          className={`w-full pl-10 pr-14 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${errors.timeframe ? "border-red-400 bg-red-50/50" : "border-gray-200"}`}
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                          weeks
                        </span>
                      </div>
                      {errors.timeframe && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.timeframe}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Error from API */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex gap-3 items-start animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Calculation Failed</span>
                      <span className="text-red-700">{error}</span>. Please check your connection or profile settings and try again.
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    id="calculate-btn"
                    disabled={isLoading}
                    className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        Get My Meal Plan
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {isLoading && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-primary-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Nutrition Data</h2>
            <p className="text-sm text-gray-500 min-h-[40px] mb-6 px-4 transition-all duration-300">
              {loadingMessage}
            </p>

            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-2 relative">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            <div className="text-xs font-semibold text-primary-600">
              {Math.round(loadingProgress)}% Complete
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
