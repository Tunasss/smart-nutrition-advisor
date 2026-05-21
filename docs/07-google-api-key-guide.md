# 🔑 Hướng Dẫn Chi Tiết Tạo Google Gemini API Key

Tài liệu này hướng dẫn chi tiết cách đăng ký, khởi tạo và cấu hình khóa **Google Gemini API Key** từ **Google AI Studio** để chạy tính năng tư vấn dinh dưỡng thông minh bằng AI trong dự án.

---

## 📋 Mục Lục
1. [Giới Thiệu Google AI Studio](#1-giới-thiệu-google-ai-studio)
2. [Các Bước Tạo API Key Miễn Phí](#2-các-bước-tạo-api-key-miễn-phí)
3. [Cấu Hình Vào Dự Án](#3-cấu-hình-vào-dự-án)
4. [Kiểm Tra Trạng Thái Hoạt Động](#4-kiểm-tra-trạng-thái-hoạt-động)
5. [Các Lỗi Thường Gặp & Cách Khắc Phục](#5-các-lỗi-thường-gặp--cách-khắc-phục)

---

## 1. Giới Thiệu Google AI Studio
**Google AI Studio** là một công cụ lập trình dựa trên web (web-based prototyping tool) của Google cho phép nhà phát triển thử nghiệm nhanh và lấy API Key để kết nối với các mô hình ngôn ngữ lớn thuộc họ **Gemini**.
- **Chi phí**: Google cung cấp gói **Free Tier** (miễn phí) với giới hạn tần suất (Rate Limit) phù hợp để chạy thử nghiệm và học tập.
- **Tương thích**: API Key tạo ra từ AI Studio có thể gọi trực tiếp các mô hình như `gemini-3.1-flash-lite`, `gemini-3.1-flash-lite-preview`, `gemini-2.5-flash`, `gemini-1.5-flash`,... vốn đang được tích hợp trong dự án này.

---

## 2. Các Bước Tạo API Key Miễn Phí

Hãy làm theo các bước dưới đây để lấy khóa API:

### Bước 1: Truy cập Google AI Studio
1. Truy cập trang web chính thức của **[Google AI Studio](https://aistudio.google.com/)**.
2. Đăng nhập bằng tài khoản **Gmail / Google Account** của bạn.

### Bước 2: Chọn mục Tạo API Key
1. Sau khi vào màn hình console của AI Studio, nhìn vào cột menu bên trái (hoặc nút bấm nổi bật trên trang chủ) và nhấp vào nút **"Get API key"** (biểu tượng chiếc chìa khóa).
2. Giao diện quản lý khóa API sẽ xuất hiện.

### Bước 3: Tạo Khóa mới
1. Nhấp vào nút màu xanh **"Create API key"** (Tạo khóa API).
2. Một hộp thoại sẽ hiện lên hỏi bạn muốn liên kết với dự án nào:
   - **Tùy chọn 1 (Khuyên dùng)**: Chọn **"Create API key in new project"** (Tạo API key trong dự án Google Cloud mới). Hệ thống sẽ tự động tạo một dự án nền cho bạn.
   - **Tùy chọn 2**: Chọn một dự án Google Cloud có sẵn trong danh sách tài khoản của bạn.
3. Chờ vài giây để Google khởi tạo dự án và tạo mã khóa.

### Bước 4: Sao chép API Key
1. Khi mã khóa được tạo thành công, một chuỗi ký tự dài (bắt đầu bằng `AIzaSy...`) sẽ hiển thị.
2. Nhấp vào nút **Copy** (Sao chép) để lưu mã này vào bộ nhớ tạm.
   
> [!WARNING]
> **Bảo mật quan trọng:** Tuyệt đối không chia sẻ khóa API Key này công khai lên GitHub, mạng xã hội hoặc bất kỳ đâu. Nếu lộ khóa, người khác có thể sử dụng và làm cạn kiệt hạn ngạch (quota) của bạn hoặc phát sinh chi phí ngoài ý muốn.

---

## 3. Cấu Hìn Vào Dự Án

Khi đã có mã khóa API (ví dụ: `AIzaSyB-xxxxx...`), hãy tích hợp nó vào môi trường chạy local của dự án:

1. Mở thư mục gốc của dự án `smart-nutrition-advisor` trên máy tính của bạn.
2. Tạo một file mới có tên là **`.env.local`** (nếu chưa có).
3. Mở file `.env.local` bằng IDE hoặc Notepad và dán cấu hình sau:

   ```env
   GEMINI_API_KEY=DÁN_MÃ_API_KEY_VỪA_COPY_VÀO_ĐÂY
   ```

   *Ví dụ minh họa:*
   ```env
   GEMINI_API_KEY=AIzaSyDpExampleKey1234567890abcdef
   ```

4. Lưu file `.env.local` lại. 

> [!NOTE]
> File `.env.local` đã được cấu hình trong `.gitignore` và `.gitattributes` để **không bao giờ** bị đẩy lên GitHub, đảm bảo an toàn tuyệt đối cho thông tin bảo mật của bạn.

---

## 4. Kiểm Trạng Thái Hoạt Động

Để kiểm tra xem khóa API hoạt động chính xác hay chưa:

1. Mở Terminal tại thư mục gốc dự án và chạy máy chủ:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000).
3. Đăng nhập/Đăng ký tài khoản, đi tới trang nhập chỉ số cơ thể (`/input`).
4. Nhập các thông số (Chiều cao, Cân nặng, Tuổi, Mục tiêu) và nhấn **"Calculate Nutrition"**.
5. Nhìn vào thanh loading tiến trình:
   - **Thành công**: Sau khoảng 2 giây, bạn sẽ được chuyển hướng tới trang Dashboard với đầy đủ thực đơn 4 bữa và biểu đồ Macros do AI đề xuất. Ở góc trên trang Dashboard sẽ hiển thị thẻ màu xanh: **✨ AI Analysis Complete**.
   - **Không thành công**: Nếu hệ thống gặp sự cố kết nối hoặc lỗi API Key, nó sẽ tự động kích hoạt cơ chế dự phòng (Offline Fallback) và hiển thị banner cảnh báo màu vàng: **⚠️ Gemini AI Offline Fallback (AI Offline)**.

---

## 5. Các Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi 1: `API key not valid. Please pass a valid API key.` (Lỗi 403)
- **Nguyên nhân**: Mã API Key dán vào `.env.local` bị sai, thiếu ký tự, hoặc chứa khoảng trắng thừa.
- **Khắc phục**: 
  - Kiểm tra lại file `.env.local` xem biến môi trường đã viết đúng tên `GEMINI_API_KEY` chưa (viết hoa toàn bộ, không có khoảng cách xung quanh dấu `=`).
  - Sao chép lại khóa trực tiếp từ Google AI Studio và dán đè lên.
  - Tắt Terminal của Next.js (`Ctrl + C`) và chạy lại `npm run dev` để hệ thống tải lại biến môi trường mới.

### Lỗi 2: `User location is not supported for the API use.`
- **Nguyên nhân**: Bạn đang ở quốc gia hoặc vùng lãnh thổ chưa được Google hỗ trợ truy cập Gemini API (mặc dù hiện tại Việt Nam đã được hỗ trợ đầy đủ, nhưng đôi khi hệ thống mạng hoặc proxy của bạn bị định tuyến sang khu vực bị hạn chế).
- **Khắc phục**:
  - Tắt các phần mềm VPN, Proxy hoặc đổi DNS sang Google (8.8.8.8 / 8.8.4.4) hoặc Cloudflare (1.1.1.1).
  - Nếu bạn đang ở nước ngoài thuộc vùng không được hỗ trợ, hãy sử dụng VPN để chuyển hướng IP sang các quốc gia được hỗ trợ (như Việt Nam, Mỹ, Singapore, Nhật Bản,...).

### Lỗi 3: Lỗi giới hạn tần suất `429 Too Many Requests`
- **Nguyên nhân**: Ở gói miễn phí (Free Tier), Google giới hạn số lượng yêu cầu gửi lên mỗi phút (thường là 15 RPM - Requests Per Minute). Nếu bạn click nút "Calculate" liên tục hoặc có nhiều người dùng chung một key, giới hạn này sẽ bị vượt qua.
- **Khắc phục**:
  - Chờ khoảng 1 phút và thử lại.
  - Dự án đã tích hợp sẵn cơ chế **History Cache** (Bộ nhớ đệm lịch sử). Khi bạn tính toán lại cùng một chỉ số cơ thể, ứng dụng sẽ lấy ngay kết quả cũ trong database mà không gửi yêu cầu lên Google, giúp tiết kiệm tối đa quota API của bạn.

### Lỗi 4: Lỗi `503 Service Unavailable` hoặc `UNAVAILABLE`
- **Nguyên nhân**: Mô hình AI của Google đang bị quá tải đột xuất tại thời điểm bạn gửi yêu cầu.
- **Khắc phục**:
  - Dự án sở hữu cơ chế **Model Failover Pool** tự động. Khi mô hình mặc định (`gemini-3.1-flash-lite`) bị quá tải và trả về lỗi 503, ứng dụng sẽ tự động chuyển đổi và gọi tiếp qua các mô hình dự phòng `gemini-3.1-flash-lite-preview`, `gemini-2.5-flash` và `gemini-1.5-flash` một cách mượt mà để lấy kết quả.
  - Trong trường hợp xấu nhất khi tất cả các mô hình của Google đều quá tải hoặc mất mạng hoàn toàn, dự án sẽ tự động chuyển sang **Offline Fallback** (sử dụng công thức toán học nội bộ để tính chỉ số BMI, TDEE, Macros và trả về thực đơn mẫu lưu sẵn trong `src/lib/mealPlans.js`) để đảm bảo trải nghiệm người dùng không bị gián đoạn.
