"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

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

  // History state
  const [history, setHistory] = useState([]);

  // Loading/Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch history from DB
  const fetchHistory = useCallback(async (email, autoLoadLatest = false) => {
    if (!email) return;
    try {
      const response = await fetch(`/api/history?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        const historyList = data.history || [];
        setHistory(historyList);
        if (autoLoadLatest && historyList.length > 0 && historyList[0].result) {
          setResult(historyList[0].result);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsAuthenticated(true);
          fetchHistory(parsed.email, true); // Auto-load latest on restoration
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
  }, [fetchHistory]);

  // Auth actions - Login
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      fetchHistory(data.user.email, true); // Auto-load latest on login
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchHistory]);

  // Auth actions - Register
  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Auto login after successful registration
      setUser(data.user);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      setHistory([]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Auth actions - Logout
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setFormData({ age: "", weight: "", height: "", goal: "lose", targetWeight: "", timeframe: "" });
    setResult(null);
    setHistory([]);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
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
      const payload = { ...data };
      if (user && user.email) {
        payload.email = user.email;
      }

      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to calculate nutrition");
      }

      const resultData = await response.json();
      setResult(resultData);

      // Refresh history log if logged in
      if (user && user.email) {
        fetchHistory(user.email);
      }

      return resultData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchHistory]);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const value = {
    // State
    user,
    isAuthenticated,
    formData,
    result,
    history,
    isLoading,
    error,
    // Actions
    login,
    register,
    logout,
    updateFormData,
    setFormData,
    calculateNutrition,
    clearResult,
    setError,
    setResult,
    fetchHistory,
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

