import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "Smart Nutrition Advisor - AI-Powered Meal Planning",
  description:
    "Get personalized meal plans and nutrition advice based on your body metrics and health goals. Calculate your BMI, daily calorie needs, and receive AI-powered diet recommendations.",
  keywords: "nutrition, meal plan, BMI calculator, diet, health, calories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
