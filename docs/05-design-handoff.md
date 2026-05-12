# Design Handoff - Developer Guidelines

## Asset List
- **Font:** Inter from Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`)
- **Icons:** Lucide React icons (lightweight, consistent)
- **Chart:** Chart.js + react-chartjs-2

## Responsive Breakpoints
| Device | Width | Columns | Padding |
|--------|-------|---------|---------|
| Mobile | < 640px | 1 | 16px |
| Tablet | 640-1024px | 2 | 24px |
| Desktop | > 1024px | 3-4 | 32px |

## Page Specifications

### Login Page
- Card: max-width 420px, centered, shadow-xl
- Background: gradient from primary-900 to primary-600
- Glassmorphism effect on card

### Input Form Page  
- Card: max-width 600px, centered
- Form grid: 2 columns on desktop, 1 on mobile
- Goal radio: styled custom radio with icons

### Dashboard Page
- Max-width: 1200px, centered
- Top row: 2 cards (BMI + Calories) - equal width
- Middle: 3 meal cards in row
- Bottom: Chart full-width
- All cards have hover lift effect

## Developer Notes
- Use Next.js App Router (app directory)
- Tailwind CSS for styling
- Context API for state management
- No external API dependency (mock API routes)
- All pages are client components where needed
