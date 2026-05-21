# 🥦 Smart Nutrition Advisor - Hướng Dẫn Toàn Diện Dự Án

Chào mừng bạn đến với dự án **Smart Nutrition Advisor** — Hệ thống tư vấn dinh dưỡng và gợi ý thực đơn ăn uống thông minh sử dụng trí tuệ nhân tạo Google Gemini API tích hợp cơ sở dữ liệu và bảo mật.

Dự án đã được phát triển hoàn tất từ khâu UI/UX Design cho đến lập trình Full-Stack bằng Next.js 16 (App Router) và Tailwind CSS 4.

---

## 📁 Cấu Trúc Dự Án

### 1. Tài liệu Thiết kế & Kiến trúc (`docs/`)
Tất cả các tài liệu được viết bằng Markdown chi tiết để bạn dễ dàng theo dõi hoặc làm báo cáo:
- [01-user-persona.md](./01-user-persona.md): Chân dung người dùng (Sinh viên, Dân tập gym) và hành trình của họ.
- [02-user-flow.md](./02-user-flow.md): Sơ đồ các luồng đi của ứng dụng qua từng trang.
- [03-wireframe.md](./03-wireframe.md): Thiết kế bố cục thô (Wireframe) của các trang chính.
- [04-design-system.md](./04-design-system.md): Quy chuẩn về màu sắc (Brand colors), phông chữ, biểu tượng.
- [05-design-handoff.md](./05-design-handoff.md): Hướng dẫn bàn giao giữa bộ phận Thiết kế và Lập trình.
- [06-analysis_results.md](./06-analysis_results.md): **[MỚI]** Phân tích chi tiết kiến trúc API, cơ sở dữ liệu bảo mật mật khẩu, tích hợp trí tuệ nhân tạo Gemini AI và cơ chế tối ưu hiệu suất.
- [07-google-api-key-guide.md](./07-google-api-key-guide.md): **[MỚI]** Hướng dẫn chi tiết cách tạo và cấu hình khóa Google Gemini API Key từ Google AI Studio cùng cách sửa các lỗi thường gặp.

### 2. Mã nguồn Ứng dụng (`src/`)
Toàn bộ mã nguồn chạy trên nền tảng Next.js (App Router):
- **Trang màn hình (`src/app/`)**:
  - `page.js` (Login/Register): Đăng nhập, đăng ký tài khoản với hiệu ứng Glassmorphism.
  - `input/page.js`: Form nhập chỉ số cơ thể, mục tiêu kèm thanh trạng thái loading tiệm cận mượt mà.
  - `dashboard/page.js`: Dashboard hiển thị chi tiết BMI, Calo, biểu đồ Macros, thực đơn hàng ngày và lịch sử tính toán.
  - `api/nutrition/route.js`: API tính toán, kiểm tra cache và gọi AI.
- **Thư viện xử lý dữ liệu (`src/lib/`)**:
  - `gemini.js`: Hàm kết nối API Google Gemini với cơ chế tự động chuyển đổi mô hình dự phòng (Failover Pool).
  - `db.js`: Quản lý đọc/ghi cơ sở dữ liệu local (`data/database.json`), băm bảo mật mật khẩu.
  - `nutrition.js`: Các công thức tính toán BMI, TDEE (Mifflin-St Jeor) và Macros.
  - `mealPlans.js`: Thực đơn dự phòng lưu sẵn khi không có kết nối Internet / AI lỗi.
- **Thành phần giao diện (`src/components/`)**:
  - `Header.js`, `Footer.js`
  - `BMICard.js`, `CaloriesCard.js`, `MealPlanTable.js`, `NutritionChart.js` (Sử dụng Chart.js để vẽ biểu đồ tròn).

---

## ⚡ Các Tính Năng & Nâng Cấp Nổi Bật

1. **Kết Nối Trực Tiếp AI Thực Tế**:
   - Sử dụng Google Gemini API để tự động sinh thực đơn và lượng calo hoàn toàn cá nhân hóa cho từng người dùng thay vì dùng dữ liệu tĩnh giả lập.
2. **Cơ Chế Dự Phòng Mô Hình (Model Failover)**:
   - Hệ thống tự động xoay tua gọi các mô hình `gemini-3.1-flash-lite` -> `gemini-3.1-flash-lite-preview` -> `gemini-2.5-flash` -> `gemini-1.5-flash` nếu gặp lỗi quá tải (503) hoặc giới hạn băng thông từ phía Google.
3. **Tối Ưu Hóa Tốc Độ API**:
   - Áp dụng các ràng buộc giới hạn độ dài nội dung phản hồi trong Prompt giúp giảm thời gian sinh token, đưa tốc độ gọi API xuống mức cực nhanh (1.5s - 2.5s).
   - Tích hợp bộ nhớ đệm Cache so khớp lịch sử giúp trả về kết quả lập tức (<50ms) nếu người dùng tính toán trùng lặp.
4. **Trải Nghiệm UX Cao Cấp**:
   - Thanh loading tiệm cận mượt mà tăng dần đều lên đến 98% và liên tục thay đổi tin nhắn trạng thái vui nhộn, tạo cảm giác chuyên nghiệp.
   - Banner cảnh báo nguồn gốc dữ liệu rõ ràng giúp phân biệt giữa kết quả được sinh từ AI thực tế và kết quả sinh dự phòng Offline khi AI bị lỗi.
5. **Bảo Mật Người Dùng**:
   - Cơ chế băm mật khẩu `HMAC-SHA256` cùng chuỗi salt riêng biệt đảm bảo an toàn thông tin tài khoản lưu trữ tại local database.

---

## 🚀 Hướng Dẫn Khởi Chạy & Cấu Hình API Key

> [!IMPORTANT]
> **Yêu cầu:** Máy tính cần cài đặt **Node.js** (Khuyên dùng phiên bản LTS mới nhất).

### 🔑 Cách lấy API Key Google Gemini miễn phí:
1. Đăng nhập vào tài khoản Gmail và truy cập trang **[Google AI Studio](https://aistudio.google.com/)**.
2. Click chọn nút **"Get API key"** tại cột menu bên trái.
3. Nhấp vào **"Create API key"** -> Chọn **"Create API key in new project"** để sinh khóa.
4. Sao chép chuỗi khóa nhận được (bắt đầu bằng `AIzaSy...`).

> [!TIP]
> Xem chi tiết các bước thực hiện và hướng dẫn sửa lỗi kết nối, quá tải hoặc giới hạn vùng lãnh thổ tại:
> 👉 **[07-google-api-key-guide.md](./07-google-api-key-guide.md)**

### ⚙️ Cấu hình và Chạy dự án:
1. Tạo một file tên là `.env.local` tại thư mục gốc của dự án.
2. Thiết lập nội dung trong file như sau (dán API Key vừa copy vào):
   ```env
   GEMINI_API_KEY=AIzaSy..._KHOA_API_CUA_BAN
   ```
3. Mở Terminal tại thư mục của dự án và chạy cài đặt thư viện:
   ```bash
   npm install
   ```
4. Khởi chạy máy chủ phát triển local:
   ```bash
   npm run dev
   ```
5. Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)
6. Biên dịch ứng dụng cho chế độ chạy Production:
   ```bash
   npm run build
   ```
