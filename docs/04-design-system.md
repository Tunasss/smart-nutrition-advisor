# Design System - Smart Nutrition Advisor

## 1. Color Palette

### Primary Colors (Health-themed Green)
| Name | HEX | Usage |
|------|-----|-------|
| Primary 50 | `#f0fdf4` | Background tint |
| Primary 100 | `#dcfce7` | Hover states |
| Primary 300 | `#86efac` | Borders |
| Primary 500 | `#22c55e` | **Main brand color** |
| Primary 600 | `#16a34a` | **Buttons, CTA** |
| Primary 700 | `#15803d` | Active states |
| Primary 900 | `#14532d` | Dark text |

### Neutral Colors
| Name | HEX | Usage |
|------|-----|-------|
| White | `#ffffff` | Card backgrounds |
| Gray 50 | `#f9fafb` | Page background |
| Gray 100 | `#f3f4f6` | Input backgrounds |
| Gray 200 | `#e5e7eb` | Borders |
| Gray 500 | `#6b7280` | Secondary text |
| Gray 700 | `#374151` | Body text |
| Gray 900 | `#111827` | Headings |

### Semantic Colors
| Name | HEX | Usage |
|------|-----|-------|
| Success | `#22c55e` | Success states |
| Warning | `#f59e0b` | Warnings |
| Error | `#ef4444` | Errors, validation |
| Info | `#3b82f6` | Info messages |

### BMI Category Colors
| Category | Color | Range |
|----------|-------|-------|
| Underweight | `#3b82f6` Blue | BMI < 18.5 |
| Normal | `#22c55e` Green | 18.5-24.9 |
| Overweight | `#f59e0b` Amber | 25-29.9 |
| Obese | `#ef4444` Red | >= 30 |

## 2. Typography
- **Font:** Inter (Google Fonts), fallback: system fonts
- Display: 48px/800 weight, H1: 36px/700, H2: 24px/600, H3: 20px/600
- Body: 16px/400, Small: 14px/400, Caption: 12px/500

## 3. Spacing (Base: 4px)
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 4. Border Radius
sm: 6px, md: 8px, lg: 12px, xl: 16px, 2xl: 24px, full: 9999px

## 5. Shadows
- sm: `0 1px 2px rgba(0,0,0,0.05)` - subtle
- md: `0 4px 6px -1px rgba(0,0,0,0.1)` - cards
- lg: `0 10px 15px -3px rgba(0,0,0,0.1)` - elevated
- xl: `0 20px 25px -5px rgba(0,0,0,0.1)` - modals
- glow: `0 0 20px rgba(34,197,94,0.3)` - CTA

## 6. Components
- **Button Primary:** bg #16a34a, text white, padding 12px 24px, radius 8px
- **Input:** bg #f9fafb, border 1px #e5e7eb, radius 8px, padding 12px 16px
- **Card:** bg white, radius 16px, padding 24px, shadow-md

## 7. Animations
- Fast: 150ms, Normal: 300ms, Slow: 500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## 8. Breakpoints
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px
