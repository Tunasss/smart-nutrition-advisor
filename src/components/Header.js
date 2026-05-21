"use client";

import { useApp } from "@/context/AppContext";
import { Salad, LogOut, User, History } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, user, logout, history, setResult } = useApp();
  const router = useRouter();

  const handleHistoryClick = () => {
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
              <Salad className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Smart Nutrition
              </h1>
              <p className="text-xs text-primary-600 font-medium -mt-0.5">
                AI-Powered Advisor
              </p>
            </div>
          </div>

          {/* User section */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 sm:gap-4">
              {/* History Button */}
              <button
                onClick={handleHistoryClick}
                id="history-header-btn"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
              >
                <History className="w-4.5 h-4.5 text-primary-600" />
                <span>Lịch sử</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full">
                <User className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  {user.name}
                </span>
              </div>

              <button
                onClick={logout}
                id="logout-btn"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
