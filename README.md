# 🚀 TECH STORE V2 - PREMIUM E-COMMERCE PLATFORM

Chào mừng bạn đến với **Tech Store v2**, hệ thống thương mại điện tử linh kiện công nghệ cao cấp. Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà, thông minh và hiện đại.

---

## 🏗️ Kiến Trúc Hệ Thống (System Architecture)

Dự án được triển khai theo mô hình **Microservices-ready Monolith** với Docker:

- **Frontend:** React.js (Vite) + Tailwind CSS + Framer Motion.
- **Backend:** Spring Boot 3 + Spring Security (JWT).
- **Database:** PostgreSQL (Lưu trữ chính), Redis (Caching & Session).
- **DevOps:** Docker Compose (Quản lý các container dịch vụ).

---

## 📂 Cấu Trúc Thư Mục & Trách Nhiệm (File Contracts)

### 🖥️ 1. Frontend (`/frontend`)
Nơi xử lý giao diện người dùng và trải nghiệm mua sắm.

- **`src/api`**: Định nghĩa các "hợp đồng" kết nối với Backend. Mỗi file (ví dụ: `chat.js`, `products.js`) chịu trách nhiệm gửi/nhận dữ liệu từ một module cụ thể.
- **`src/components`**: Chứa các linh kiện giao diện tái sử dụng.
  - **`chat/ChatWidget.jsx`**: Trợ lý AI nổi, xử lý tương tác trực tiếp với khách hàng.
  - **`Layout.jsx`**: Khung xương của website, chứa Header, Footer và các thành phần toàn cục.
- **`src/pages`**: Các trang chính của hệ thống (Trang chủ, Sản phẩm, Giỏ hàng, Thông báo...).
- **`src/store`**: Quản lý trạng thái toàn cục bằng Redux Toolkit (Cart, Wishlist, Auth, Chat).
- **`vite.config.js`**: Cấu hình PWA (Progressive Web App), cho phép ứng dụng chạy offline và cài đặt như ứng dụng di động.

### ⚙️ 2. Backend (`/backend`)
Trung tâm xử lý logic nghiệp vụ và bảo mật.

- **`controller`**: Điểm tiếp nhận yêu cầu (Endpoints).
  - `ChatController.java`: Cổng giao tiếp công khai cho Chatbot AI.
- **`service`**: Xử lý logic nghiệp vụ phức tạp.
  - `ChatService.java`: "Bộ não" của hệ thống Chat, tích hợp logic tra cứu đơn hàng và gợi ý sản phẩm.
- **`repository`**: Giao tiếp trực tiếp với Database thông qua Spring Data JPA.
- **`entity`**: Định nghĩa các thực thể dữ liệu (Product, Order, User...).
- **`dto`**: (Data Transfer Object) Định nghĩa các khuôn mẫu dữ liệu luân chuyển giữa Frontend và Backend.
  - `ChatRequest.java`, `ChatResponse.java`: Các "hợp đồng" dữ liệu cho module Chat.
- **`security`**: Cấu hình bảo mật JWT, phân quyền người dùng và bảo mật hệ thống.

---

## 🧠 Phân Tích Nghiệp Vụ Backend Chi Tiết (Backend Deep Dive)

Dưới đây là giải thích chi tiết về cách mã nguồn vận hành tại tầng Backend để xử lý các yêu cầu phức tạp.

### 1. Module Trợ Lý AI (`ChatService.java`)
Đây là "linh hồn" của hệ thống phản hồi tự động.
- **Logic Nhận Diện Ý Định (Intent Recognition):** 
  - Sử dụng `.toLowerCase()` để chuẩn hóa tin nhắn, sau đó dùng các bộ lọc từ khóa (`keywords`) như "đơn hàng", "tư vấn", "nhân viên".
- **Tra Cứu Đơn Hàng Thông Minh:**
  - Code sử dụng Regex `replaceAll("\\D+", "")` để tách mã số từ tin nhắn của khách (Ví dụ: "Đơn số 123" -> "123").
  - Tiếp theo, nó gọi `orderRepository.findById(orderId)` để truy vấn trạng thái thực tế từ Database và trả về nhãn tiếng Việt tương ứng cho khách hàng.
- **Gợi Ý Sản Phẩm Tự Động:**
  - Khi khách yêu cầu tư vấn, Service sử dụng `JpaSpecificationExecutor` để thực hiện tìm kiếm mờ (`LIKE %keyword%`) trong bảng sản phẩm, giới hạn 3 kết quả hàng đầu để đảm bảo tốc độ phản hồi.

### 2. Module Bảo Mật & Phân Quyền (`SecurityConfig.java`)
Hệ thống sử dụng kỹ thuật "Phòng thủ theo chiều sâu":
- **`AbstractHttpConfigurer::disable`**: Tắt CSRF vì hệ thống sử dụng kiến trúc Stateless (JWT), giúp tối ưu hiệu năng cho các ứng dụng SPA (Single Page Application).
- **`permitAll()`**: Thiết lập các con đường ngoại lệ cho các module công khai (Auth, Public API, Chatbot) để đảm bảo trải nghiệm khách hàng không bị ngắt quãng.
- **`addFilterBefore(jwtAuthFilter, ...)`**: Đặt bộ lọc JWT lên trước các bộ lọc mặc định của Spring. Mỗi dòng code trong `JwtAuthenticationFilter` đảm nhiệm việc giải mã chuỗi JWT, xác thực danh tính người dùng từ database và thiết lập quyền hạn (`Authorities`) cho phiên làm việc đó.

### 3. Module Dữ Liệu & Thực Thể (Entity & Repository)
- **`BaseEntity.java`**: Chứa các trường hệ thống như `createdAt`, `updatedAt` và `id`. Các trường này tự động cập nhật nhờ `@CreationTimestamp` và `@UpdateTimestamp`, giúp việc quản lý dòng thời gian của đơn hàng luôn chính xác mà không cần code tay.
- **`OrderRepository.java`**: Chứa các câu lệnh SQL nâng cao (`Native Query`). 
  - Nghiệp vụ báo cáo: Nó sử dụng `SUM(totalAmount)` kết hợp với `GROUP BY CAST(created_at AS DATE)` để tạo ra biểu đồ doanh thu 30 ngày gần nhất cho Admin, giúp chủ cửa hàng theo dõi sức khỏe kinh doanh trong tích tắc.

---

## 📜 Đặc Tả "Hợp Đồng" Dữ Liệu (DTO)
Mỗi file DTO đóng vai trò là một "Hợp đồng" cam kết giữa Frontend và Backend:
- **`ProductResponse`**: Đóng gói thông tin sản phẩm đầy đủ bao gồm variants, images, và rating. Việc dùng DTO thay vì Entity giúp giấu đi những thông tin nhạy cảm của hệ thống.
- **`ChatResponse`**: Chứa cờ `requiresHuman`. Nếu giá trị này là `true`, Frontend sẽ hiểu rằng AI không thể xử lý tiếp và cần hiển thị nút "Kết nối với nhân viên".

---

## 🚀 Quy Trình Xử Lý Một Yêu Cầu (Request Workflow)
1. **Tiếp nhận:** `Controller` nhận JSON từ người dùng thông qua các `@PostMapping`.
2. **Ủy quyền:** `JwtAuthenticationFilter` kiểm tra xem người dùng là ai qua Token.
3. **Thực thi:** `Service` gọi các phương thức nghiệp vụ, truy vấn database qua `Repository`.
4. **Hồi đáp:** Dữ liệu từ database được `Mapper` chuyển đổi sang `DTO` và gửi về máy khách dưới dạng JSON chuẩn.

---

## 🛠️ Hướng Dẫn Khởi Chạy (Quick Start)
... (Phần hướng dẫn Docker giữ nguyên như trên)

Yêu cầu: Đã cài đặt **Docker** và **Docker Compose**.

1. **Khởi động toàn bộ hệ thống:**
   ```bash
   docker-compose up -d
   ```

2. **Chế độ phát triển (Auto update):**
   ```bash
   docker-compose watch
   ```

---

## 📜 Cam Kết Chất Lượng
Dự án Tech Store v2 cam kết mã nguồn sạch, cấu trúc rõ ràng và hiệu suất tối ưu để sẵn sàng mở rộng trong tương lai.
