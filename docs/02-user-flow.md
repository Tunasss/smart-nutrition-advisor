# User Flow & Screen Flow Map

## Screen 1: Login Page (`/`)
| Thành phần | Mô tả |
|-----------|--------|
| Logo | Smart Nutrition Advisor logo |
| Email Input | Ô nhập email |
| Password Input | Ô nhập mật khẩu |
| Login Button | Nút đăng nhập |
| Error Message | Thông báo lỗi (nếu có) |

## Screen 2: Input Form Page (`/input`)
| Thành phần | Mô tả |
|-----------|--------|
| Header | Navigation bar + user info |
| Age Input | Ô nhập tuổi (number, 1-120) |
| Weight Input | Ô nhập cân nặng kg (number, 20-300) |
| Height Input | Ô nhập chiều cao cm (number, 50-250) |
| Goal Select | Radio buttons: Lose Weight / Gain Weight / Maintain |
| Submit Button | Gửi form |
| Validation | Real-time validation messages |

## Screen 3: Dashboard Page (`/dashboard`)
| Thành phần | Mô tả |
|-----------|--------|
| Header | Navigation bar |
| BMI Card | Chỉ số BMI + phân loại + color indicator |
| Calories Card | Lượng calories đề xuất/ngày |
| Meal Plan Section | 3 cards: Breakfast / Lunch / Dinner |
| Nutrition Chart | Biểu đồ tròn phân bổ macros |
| New Calculation Button | Quay lại nhập thông tin mới |

## 📌 Navigation Logic

```
Route: /           → Login Page (public)
Route: /input       → Input Form (protected - cần đăng nhập)
Route: /dashboard   → Dashboard (protected - cần có kết quả)

Redirect Rules:
- Chưa login → redirect về /
- Chưa có result → redirect về /input
- Đăng xuất → redirect về /
```
