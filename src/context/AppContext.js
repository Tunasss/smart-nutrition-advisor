"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "lose",
    targetWeight: "",
    timeframe: "",
  });

  // Result data state
  const [result, setResult] = useState(null);

  // Loading/Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth actions
  const login = useCallback((email, password) => {
    // Mock authentication
    if (email && password) {
      setUser({ email, name: email.split("@")[0] });
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    setError("Invalid credentials");
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setFormData({ age: "", weight: "", height: "", goal: "lose", targetWeight: "", timeframe: "" });
    setResult(null);
    setError(null);
  }, []);

  // Form actions
  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // API call to get nutrition results
  const calculateNutrition = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate nutrition");
      }

      const resultData = await response.json();
      setResult(resultData);
      return resultData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    formData,
    result,
    isLoading,
    error,
    // Actions
    login,
    logout,
    updateFormData,
    setFormData,
    calculateNutrition,
    clearResult,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
