# Smart Nutrition Advisor - Project Completion

Tôi đã hoàn thành việc xây dựng toàn bộ dự án **Smart Nutrition Advisor** dựa trên 2 file mô tả yêu cầu của bạn, đóng vai trò cả UI/UX Designer và Frontend Developer.

Do môi trường hiện tại chưa cài đặt Node.js, tôi đã thiết lập toàn bộ cấu trúc dự án và viết code thủ công. Bạn có thể tự chạy dự án này trên máy tính của mình.

## 📁 Cấu trúc thư mục

### 1. Phần UI/UX Design (Thư mục `docs/`)
Tất cả tài liệu thiết kế đều được viết bằng Markdown, sẵn sàng để gửi cho team hoặc nộp báo cáo:
- `01-user-persona.md`: Chân dung người dùng (Sinh viên, Dân gym) và hành trình người dùng.
- `02-user-flow.md`: Sơ đồ luồng ứng dụng và chi tiết các màn hình.
- `03-wireframe.md`: Cấu trúc layout thô của 3 trang chính.
- `04-design-system.md`: Bảng màu sắc, typography, component specs.
- `05-design-handoff.md`: Hướng dẫn dành cho Developer.

### 2. Phần Frontend (Thư mục `src/`)
Toàn bộ source code Next.js 15 (App Router) với Tailwind CSS v4:
- **Pages (`src/app/`)**:
  - `/`: Login Page với giao diện Glassmorphism.
  - `/input`: Form nhập thông tin cá nhân.
  - `/dashboard`: Trang hiển thị kết quả.
  - `/api/nutrition`: Mock API giả lập tính toán AI.
- **Components (`src/components/`)**:
  - `Header.js`, `Footer.js`
  - `BMICard.js`, `CaloriesCard.js`, `MealPlanTable.js`, `NutritionChart.js`
- **Context (`src/context/`)**: Quản lý State toàn cục bằng React Context.
- **Lib (`src/lib/`)**: Các hàm tính toán BMI, TDEE, Macros và dữ liệu Meal Plan.

---

## 🚀 Hướng dẫn chạy dự án

> [!IMPORTANT]
> **Yêu cầu:** Máy tính của bạn cần được cài đặt **Node.js** (tải tại nodejs.org).

1. Mở Terminal (Command Prompt hoặc PowerShell).
2. Di chuyển vào thư mục dự án:
   ```bash
   cd smart-nutrition-advisor
   ```
3. Cài đặt các thư viện:
   ```bash
   npm install
   ```
4. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
5. Mở trình duyệt và truy cập `http://localhost:3000`.

## ✨ Các tính năng nổi bật
- **Giao diện hiện đại:** Sử dụng Glassmorphism, Gradient tinh tế, và các micro-animations mượt mà.
- **Biểu đồ động:** Tích hợp Chart.js để vẽ biểu đồ phân bổ dinh dưỡng (Protein/Carbs/Fat).
- **Trải nghiệm liền mạch:** Quản lý state tốt, không cần load lại trang khi chuyển form.
- **Responsive:** Hoạt động tốt trên cả điện thoại và máy tính.
