# 🥦 Smart Nutrition Advisor

Hệ thống tư vấn dinh dưỡng và gợi ý thực đơn ăn uống thông minh sử dụng Trí Tuệ Nhân Tạo Google Gemini API kết hợp lưu trữ cơ sở dữ liệu lịch sử và bảo mật tài khoản.

Dự án được xây dựng trên nền tảng Next.js 16 (App Router) và Tailwind CSS 4.

---

## 🛠️ Hướng Dẫn Thiết Lập Khóa Google Gemini API Key

Để chạy tính năng AI ước tính thực đơn dinh dưỡng, bạn cần thiết lập khóa API Key của Google Gemini:

### 1. Cách đăng ký lấy API Key miễn phí:
1. Truy cập trang **[Google AI Studio](https://aistudio.google.com/)**.
2. Đăng nhập bằng tài khoản Google (Gmail) của bạn.
3. Nhấp vào nút **"Get API key"** (ở cột menu bên trái).
4. Nhấn **"Create API key"** -> Chọn **"Create API key in new project"** (hoặc chọn dự án Google Cloud có sẵn).
5. Sao chép chuỗi mã khóa được tạo ra (chuỗi ký tự bắt đầu bằng chữ `AIzaSy...`).

### 2. Cấu hình vào dự án:
1. Tạo một file tên là `.env.local` ở thư mục gốc của dự án nếu chưa có.
2. Thêm dòng khai báo biến môi trường sau và dán khóa API Key của bạn vào:
   ```env
   GEMINI_API_KEY=DÁN_KHÓA_API_KEY_CỦA_BẠN_VÀO_ĐÂY
   ```
3. Lưu file lại và khởi động lại Server phát triển (`npm run dev`) để nhận biến môi trường mới.

> [!TIP]
> Xem hướng dẫn đầy đủ, chi tiết từng bước bằng hình ảnh và cách xử lý khi gặp lỗi (lỗi vùng lãnh thổ, lỗi quá tải, rate limit) tại:
> 👉 **[Tài liệu hướng dẫn tạo Google Gemini API Key](docs/07-google-api-key-guide.md)**


---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống:
*   Máy tính đã cài đặt **Node.js** (Phiên bản 18.x trở lên).

### Các bước khởi chạy:

1. **Cài đặt các thư viện liên quan:**
   Mở terminal tại thư mục gốc của dự án (`smart-nutrition-advisor`) và chạy lệnh:
   ```bash
   npm install
   ```

2. **Chạy server phát triển (Development):**
   ```bash
   npm run dev
   ```

3. **Mở trình duyệt xem kết quả:**
   Truy cập đường dẫn: [http://localhost:3000](http://localhost:3000)

4. **Biên dịch sản phẩm (Production Build):**
   ```bash
   npm run build
   ```

---

## 📂 Cấu Trúc Dự Án

- `docs/`: Tài liệu đặc tả UI/UX Design (Persona, User Flow, Wireframe, Design System, Walkthrough, Phân tích Kiến trúc & AI, Hướng dẫn tạo API Key).
- `data/`: Nơi lưu trữ file cơ sở dữ liệu `database.json` chứa thông tin đăng ký người dùng mã hóa mật khẩu và nhật ký tính toán (đã được bỏ qua bằng `.gitignore` tránh lộ thông tin cá nhân lên GitHub).
- `src/app/`: Các trang giao diện (Login/Register, Input Form, Dashboard) và API Routes xử lý dữ liệu.
- `src/components/`: Các React component tái sử dụng (Biểu đồ, thẻ thông số, bảng thực đơn).
- `src/context/`: Context quản lý State đăng nhập, biểu mẫu và dữ liệu đo lường toàn cục.
- `src/lib/`: Các tiện ích tính toán BMI/TDEE/Macros, kết nối API Gemini và thực đơn mẫu offline.

---

## ✨ Tính Năng Nổi Bật

- **Phân Tích AI Gemini**: Tư vấn lượng calo, phân bổ macronutrients (Protein/Carbs/Fat) và thực đơn 4 bữa hàng ngày cá nhân hóa cực kỳ nhanh nhờ tối ưu hóa độ dài token trong prompt.
- **Dự Phòng Đa Tầng Mô Hình**: Tự động chuyển đổi failover xoay tua qua các đời mô hình `gemini-3.1-flash-lite` -> `gemini-3.1-flash-lite-preview` -> `gemini-2.5-flash` -> `gemini-1.5-flash` nếu một mô hình bị quá tải (lỗi 503) hoặc chạm giới hạn.
- **Bộ Nhớ Đệm Lịch Sử (Cache)**: Trả kết quả tức thì (<50ms) nếu đo lường lặp chỉ số cũ mà không cần gọi API Google.
- **Bảo Mật Tài Khoản**: Mã hóa mật khẩu người dùng bằng hàm băm muối `HMAC-SHA256` trước khi lưu vào file database.
- **Giao Diện Gọn Gàng & Bắt Mắt**: Thiết kế Glassmorphism mịn màng kết hợp biểu đồ tròn phân tích dinh dưỡng sinh động và thanh loading tiệm cận mượt mà.
