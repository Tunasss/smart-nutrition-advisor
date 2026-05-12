import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            © 2026 Smart Nutrition Advisor. Made with
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            for your health.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400">
              AI-Powered Meal Planning
            </span>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
