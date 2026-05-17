# Smart Nutrition Advisor

This is a Next.js application that provides AI-powered meal planning and nutrition advice.

## Prerequisites

- Node.js 18.x or later installed on your system.
- npm (comes with Node.js)

## Getting Started

1. **Install dependencies:**
   Open a terminal in this directory (`smart-nutrition-advisor`) and run:
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `docs/`: UI/UX design documents (Personas, User Flow, Wireframes, Design System)
- `src/app/`: Next.js App Router pages and API routes
- `src/components/`: Reusable React components
- `src/context/`: React Context for global state management
- `src/lib/`: Utility functions and mock data

## Features

- **Login Page**: Mock authentication with glassmorphism UI.
- **Input Form**: User data collection (age, weight, height, goal) with real-time validation.
- **Dashboard**: Results page featuring BMI calculation, Calorie needs, tailored Meal Plans, and a Macro breakdown chart.
- **Mock API**: Simulates backend processing and AI generation of meal plans.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Chart.js + react-chartjs-2
