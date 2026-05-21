# 📊 Phân Tích Dự Án Smart Nutrition Advisor

## Tổng Quan Kiến Trúc Hệ Thống

| Thành phần | Công nghệ / Thư viện |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Icons** | lucide-react |
| **Charts** | chart.js + react-chartjs-2 |
| **State Management** | React Context API |
| **Database** | Local JSON File Database (`data/database.json`) |
| **AI Integration** | Google Gemini Developer API (v1beta) |
| **Security** | Hashing PBKDF2/HMAC-SHA256 với Salt ngẫu nhiên |

---

## 1. Cơ Sở Dữ Liệu & Bảo Mật (`data/database.json`)

Hệ thống tích hợp một database dạng file JSON lưu trữ tại [database.json](../data/database.json). Các tác vụ đọc/ghi được quản lý qua module [db.js](../src/lib/db.js):

- **Bảo mật mật khẩu**: Mật khẩu người dùng khi đăng ký sẽ được băm bằng thuật toán `HMAC-SHA256` đi kèm với một chuỗi `salt` dài 16 bytes ngẫu nhiên được sinh ra cho từng tài khoản. Database hoàn toàn không lưu trữ mật khẩu thuần (plaintext).
- **Lịch sử tính toán**: Mỗi kết quả đo lường và thực đơn dinh dưỡng đều được lưu trữ theo tài khoản người dùng (`email`), chứa đầy đủ các chỉ số đầu vào cùng kết quả trả về từ AI để phục vụ hiển thị lịch sử và tối ưu hóa bộ nhớ đệm (Cache).

---

## 2. API Routes (Server-Side)

Dự án phát triển hệ thống API Backend gồm các route sau:

### 🔑 `POST /api/auth/register`
- **Chức năng**: Đăng ký tài khoản người dùng mới. Mã hóa mật khẩu và thêm vào database.

### 🔓 `POST /api/auth/login`
- **Chức năng**: Xác thực đăng nhập. So khớp hash mật khẩu và lưu phiên làm việc (Local Storage).

### 📜 `GET /api/history`
- **Chức năng**: Lấy danh sách lịch sử tính toán của người dùng (sắp xếp theo thời gian mới nhất).

### 🥦 `POST /api/nutrition` — [route.js](../src/app/api/nutrition/route.js)
- **Chức năng**: Nhận chỉ số người dùng và trả về kết quả phân tích BMI, Calo, Macros và Thực đơn dinh dưỡng.
- **Request body**:
  ```json
  {
    "age": 20,
    "weight": 65,
    "height": 176,
    "goal": "lose" | "gain" | "maintain",
    "targetWeight": 60,    // Tùy chọn
    "timeframe": 12,       // Tùy chọn (tuần)
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "bmi": 21.0,
    "bmiCategory": { "label": "Normal", "color": "#10b981" },
    "calories": 2275,
    "macros": {
      "protein": { "grams": 104, "percentage": 18 },
      "carbs": { "grams": 312, "percentage": 55 },
      "fat": { "grams": 68, "percentage": 27 }
    },
    "mealPlan": {
      "breakfast": { "name": "...", "description": "...", "calories": 500, "protein": 25, "carbs": 60, "fat": 15, "items": ["..."], "emoji": "🥣" },
      "lunch": { ... },
      "dinner": { ... },
      "snack": { ... }
    },
    "isAI": true,
    "userInfo": { ... }
  }
  ```

---

## 3. Tích Hợp Google Gemini API & Cơ Chế Dự Phòng (`src/lib/gemini.js`)

Ứng dụng kết nối trực tiếp với API Google Gemini để sinh thực đơn và tính toán cá nhân hóa theo các tiêu chí sau:

### 🤖 Cơ chế Dự phòng Mô hình (Model Failover Pool)
Để giải quyết tình trạng nghẽn kết nối hoặc quá tải hệ thống từ Google (lỗi `503 Service Unavailable` hoặc `429 Rate Limit`), hệ thống tự động chạy vòng lặp dự phòng qua các mô hình:
1. **`gemini-3.1-flash-lite`** (Mô hình chính - tốc độ cực nhanh, nhẹ và tối ưu chi phí hiệu quả).
2. **`gemini-3.1-flash-lite-preview`** (Dự phòng 1 - phiên bản preview thế hệ 3.1).
3. **`gemini-2.5-flash`** (Dự phòng 2 - mô hình thế hệ 2.5 ổn định, tối ưu cấu trúc JSON).
4. **`gemini-1.5-flash`** (Dự phòng 3 - mô hình thế hệ cũ băng thông rộng).

Nếu tất cả các mô hình AI đều lỗi hoặc không có Internet, hệ thống sẽ tự động chuyển sang chế độ **Offline Fallback** (tính toán bằng thuật toán Mifflin-St Jeor nội bộ và lấy thực đơn từ [mealPlans.js](../src/lib/mealPlans.js)).

### ⚡ Các Tối Ưu Hóa Tốc Độ API (Performance Optimizations)
- **Rút ngắn độ dài đầu ra (Token Constraints)**: Prompt được bổ sung ràng buộc nghiêm ngặt yêu cầu mô tả món ăn dưới 15 từ và giới hạn danh sách nguyên liệu tối đa 4 món. Điều này giúp giảm số lượng token cần sinh ra, rút ngắn thời gian gọi API xuống chỉ còn **1.5s - 2.5s**.
- **Bộ nhớ đệm lịch sử (History Caching)**: Khi gọi API `/api/nutrition`, hệ thống sẽ so khớp với các chỉ số đo lường trước đó của tài khoản. Nếu phát hiện trùng khớp hoàn toàn, kết quả cũ sẽ được trả về lập tức (dưới **50ms**), bỏ qua việc gọi Gemini API và giảm tải đáng kể.

---

## 4. UI/UX & Giao Diện Người Dùng

### 🌀 Hệ thống Loading Trực Quan (Input Page)
- Thiết kế màn hình chờ Glassmorphism làm mờ toàn trang (`backdrop-blur-md`).
- Vòng tròn tiến trình phát sáng đập theo nhịp (`Activity icon animate-pulse`) cùng thanh loading tăng dần tiệm cận từ 0% đến 98%.
- Thay đổi thông điệp trạng thái liên tục giúp người dùng không cảm thấy sốt ruột khi hệ thống đang xử lý dữ liệu AI.

### ⚠️ Cảnh báo Dự phòng (Dashboard Page)
- Nếu kết quả trả về sử dụng thuật toán Offline (khi AI bị sập), hệ thống hiển thị banner cảnh báo màu vàng nổi bật: **"Gemini AI Offline Fallback"** cùng thẻ trạng thái **"Formula-based Fallback (AI Offline)"**. 
- Nếu thành công với AI, hệ thống hiển thị thẻ xanh ngọc: **"AI Analysis Complete"** cùng biểu tượng lấp lánh `Sparkles`.

---

## 5. Tổng Kết Thành Phần Mã Nguồn

1. **`src/app/api/nutrition/route.js`**: Điểm nhận dữ liệu tính toán, quản lý bộ nhớ đệm Cache và xử lý kết quả dự phòng Offline.
2. **`src/lib/gemini.js`**: Tích hợp gọi API Gemini, cấu hình Schema JSON định dạng đầu ra, và chạy cơ chế Failover giữa các đời mô hình Flash.
3. **`src/lib/db.js`**: Hệ cơ sở dữ liệu đọc/ghi file local lưu thông tin người dùng mã hóa mật khẩu và nhật ký tính toán.
4. **`src/app/input/page.js`**: Form nhập liệu 2 bước chứa thanh loading tiệm cận mượt mà và thông báo lỗi kết nối sắc nét.
5. **`src/app/dashboard/page.js`**: Dashboard hiển thị biểu đồ tròn macro dinh dưỡng, bảng thực đơn, lịch sử đo và thông tin nguồn gốc dữ liệu (AI vs Fallback).
