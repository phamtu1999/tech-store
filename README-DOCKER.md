# Hướng dẫn chạy Dự án với Docker và Railway

Dự án TechStore v2 đã được cấu hình hoàn chỉnh để chạy trong môi trường container.

## 1. Chạy dưới Local (Docker Compose)

### Yêu cầu
- Đã cài đặt Docker và Docker Compose.
- File `.env` tại thư mục gốc (copy từ `.env.example`).

### Các bước thực hiện
1. Sao chép cấu hình mẫu:
   ```powershell
   cp .env.example .env
   ```
2. Cập nhật các giá trị bí mật trong `.env` (như JWT_SECRET_KEY, VNPAY, CLOUDINARY...).
3. Khởi động hệ thống:
   ```powershell
   docker compose up --build
   ```
4. Truy cập:
   - Frontend: http://localhost:5173
   - BFF (API Gateway): http://localhost:3000
   - Backend: http://localhost:8080
   - Redis: localhost:6379
   - Postgres: localhost:5432

---

## 2. Triển khai trên Railway

### Bước 1: Tạo các dịch vụ cơ sở dữ liệu
1. Tạo một **PostgreSQL** service trên Railway.
2. Tạo một **Redis** service trên Railway.

### Bước 2: Triển khai Monorepo
Bạn cần tạo 3 dịch vụ riêng biệt từ cùng một GitHub Repository:

#### A. Dịch vụ Backend (Spring Boot)
- **Root Directory**: `backend`
- **Environment Variables**:
  - `SPRING_PROFILES_ACTIVE`: `prod`
  - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` (Copy từ PostgreSQL service).
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (Copy từ Redis service).
  - `JWT_SECRET_KEY`: (Chuỗi ngẫu nhiên dài).
  - `VNPAY_...`, `CLOUDINARY_...`: (Thông tin của bạn).

#### B. Dịch vụ BFF (NestJS Gateway)
- **Root Directory**: `bff`
- **Environment Variables**:
  - `BACKEND_URL`: URL của dịch vụ Backend trên Railway.
  - `REDIS_URL`: URL của Redis (Railway sẽ tự cung cấp hoặc bạn copy từ service Redis).
  - `FRONTEND_URL`: URL của dịch vụ Frontend trên Railway.
  - `SESSION_SECRET`: (Chuỗi ngẫu nhiên).

#### C. Dịch vụ Frontend (React)
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `VITE_API_URL`: URL của dịch vụ BFF trên Railway + `/api/v1`.

### Lưu ý quan trọng
- Railway sẽ tự động nhận diện `Dockerfile` trong từng thư mục.
- Cổng (`PORT`) sẽ được Railway tự động nạp vào biến môi trường, mã nguồn đã được cấu hình để ưu tiên biến này.
- **Health Check**: Các dịch vụ đã được cấu hình để lắng nghe trên `0.0.0.0`, đảm bảo Railway có thể kiểm tra trạng thái hoạt động.
