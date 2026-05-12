# Wireframe Descriptions (Low-Fidelity)

## 📌 Wireframe 1: Login Page

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│          ┌─────────────────────────┐            │
│          │                         │            │
│          │     🥗 LOGO + Title     │            │
│          │  Smart Nutrition Advisor │            │
│          │                         │            │
│          │  ┌───────────────────┐  │            │
│          │  │ Email             │  │            │
│          │  └───────────────────┘  │            │
│          │                         │            │
│          │  ┌───────────────────┐  │            │
│          │  │ Password          │  │            │
│          │  └───────────────────┘  │            │
│          │                         │            │
│          │  ┌───────────────────┐  │            │
│          │  │    LOGIN BUTTON   │  │            │
│          │  └───────────────────┘  │            │
│          │                         │            │
│          │  Don't have account?    │            │
│          │  Sign up                │            │
│          └─────────────────────────┘            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Layout Notes:
- **Centered card** trên nền gradient
- Form chiếm khoảng 400px width
- Logo + tiêu đề phía trên form
- Spacing giữa các element: 16-24px
- Mobile: Card full-width với padding

---

## 📌 Wireframe 2: Input Form Page

```
┌─────────────────────────────────────────────────────┐
│  🥗 Smart Nutrition    [User Avatar] [Logout]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│        Tell us about yourself                       │
│        Fill in your details to get personalized     │
│        nutrition recommendations                    │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │                                             │   │
│   │   Age              Weight (kg)              │   │
│   │   ┌──────────┐     ┌──────────┐             │   │
│   │   │ 25       │     │ 70       │             │   │
│   │   └──────────┘     └──────────┘             │   │
│   │                                             │   │
│   │   Height (cm)      Goal                     │   │
│   │   ┌──────────┐     ┌──────────────────┐     │   │
│   │   │ 175      │     │ ◉ Lose Weight    │     │   │
│   │   └──────────┘     │ ○ Gain Weight    │     │   │
│   │                    │ ○ Maintain       │     │   │
│   │                    └──────────────────┘     │   │
│   │                                             │   │
│   │   ┌─────────────────────────────────────┐   │   │
│   │   │        GET MY MEAL PLAN  →          │   │   │
│   │   └─────────────────────────────────────┘   │   │
│   │                                             │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  © 2026 Smart Nutrition Advisor                     │
└─────────────────────────────────────────────────────┘
```

### Layout Notes:
- **Header** cố định trên cùng
- Form trong **card centered** 
- 2 cột cho desktop (Age+Weight, Height+Goal)
- 1 cột cho mobile
- Goal selection dùng **radio buttons** với icons
- CTA button nổi bật (full-width trong card)
- Footer đơn giản

---

## 📌 Wireframe 3: Dashboard Page

```
┌───────────────────────────────────────────────────────────┐
│  🥗 Smart Nutrition    [User Avatar] [Logout]             │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Your Nutrition Dashboard                                 │
│  Based on your profile: 25y, 70kg, 175cm                 │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  📊 YOUR BMI     │  │  🔥 DAILY       │                │
│  │                  │  │  CALORIES        │                │
│  │   22.9           │  │                  │                │
│  │   ████████░░     │  │   1,800 kcal     │                │
│  │   Normal Weight  │  │                  │                │
│  │                  │  │   To lose weight  │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                           │
│  ┌───────────────────────────────────────────────────┐    │
│  │  🍽️ Your Daily Meal Plan                          │    │
│  │                                                   │    │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐          │    │
│  │  │🌅       │  │☀️       │  │🌙        │          │    │
│  │  │Breakfast│  │ Lunch   │  │ Dinner   │          │    │
│  │  │         │  │         │  │          │          │    │
│  │  │Oatmeal  │  │Grilled  │  │Salmon    │          │    │
│  │  │+ Fruits │  │Chicken  │  │+ Veggies │          │    │
│  │  │         │  │Salad    │  │          │          │    │
│  │  │450 kcal │  │600 kcal │  │550 kcal  │          │    │
│  │  └─────────┘  └─────────┘  └──────────┘          │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ┌───────────────────────────────────────────────────┐    │
│  │  📈 Nutrition Breakdown (Pie Chart)                │    │
│  │                                                   │    │
│  │        ╭───╮                                      │    │
│  │      ╱Carbs ╲    Protein: 30%                     │    │
│  │     │  45%   │   Carbs: 45%                       │    │
│  │      ╲     ╱    Fat: 25%                          │    │
│  │        ╰───╯                                      │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────┐                  │
│  │      ← Calculate Again              │                  │
│  └─────────────────────────────────────┘                  │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  © 2026 Smart Nutrition Advisor                           │
└───────────────────────────────────────────────────────────┘
```

### Layout Notes:
- **BMI + Calories:** 2 cards side-by-side (desktop), stacked (mobile)
- **BMI Card:** Hiển thị số + progress bar + label phân loại
- **Calories Card:** Số lớn + mô tả mục tiêu
- **Meal Plan:** 3 cards ngang cho 3 bữa (responsive → stack trên mobile)
- **Chart:** Pie chart full-width phía dưới
- **CTA:** Nút quay lại nhập thông tin mới

---

## 📌 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | 1 column, cards stacked |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px | Full layout, side-by-side cards |
