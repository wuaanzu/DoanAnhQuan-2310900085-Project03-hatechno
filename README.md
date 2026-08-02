# HATECHNO HRM - Hệ Thống Quản Lý Nhân Sự HATECHNO

Hệ thống quản lý nhân sự tổng thể xây dựng trên kiến trúc **Spring Boot REST API (Backend)** kết hợp với **ReactJS Single Page Application (Frontend)**.

---

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Java 17+, Spring Boot, Spring Security (JWT Token Authentication), Spring Data JPA, Hibernate, MySQL.
- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Recharts (Biểu đồ), FontAwesome & Lucide Icons, Glassmorphism CSS3 Theme.

---

## 🚀 Hướng Dẫn Khởi Chạy Dự Án (Step-by-Step)

### 1. Chuẩn Bị Cơ Sở Dữ Liệu (MySQL)
1. Mở MySQL Server (ví dụ qua XAMPP, MySQL Workbench hoặc Docker).
2. Tạo CSDL tên `hatechno`:
   ```sql
   CREATE DATABASE hatechno CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import file dữ liệu mẫu đã có sẵn ở thư mục gốc dự án:
   - File SQL: `Hatechno+.sql` hoặc `Hatechno.sql`

---

### 2. Khởi Chạy Backend (Spring Boot REST API)
1. Mở Terminal / Command Prompt và di chuyển vào thư mục backend:
   ```bash
   cd e:\DoanAnhQuan-2310900085-Project03-hatechno\quan.comdemo\quan.comdemo
   ```
2. Kiểm tra thông tin kết nối CSDL trong `src/main/resources/application.properties` (Mặc định: port 3306, user: `root`, pass: ``).
3. Khởi chạy dự án Spring Boot:
   ```bash
   mvn spring-boot:run
   ```
   *(Backend sẽ chạy tại: `http://localhost:8080`)*

---

### 3. Khởi Chạy Frontend (ReactJS SPA)
1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd e:\DoanAnhQuan-2310900085-Project03-hatechno\frontend-react
   ```
2. (Tùy chọn) Cài đặt các gói phụ thuộc nếu chạy lần đầu:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển ReactJS:
   ```bash
   npm run dev
   ```
4. Truy cập ứng dụng trên trình duyệt:
   👉 **`http://localhost:5173`**

---

## 🔑 Tài Khoản Đăng Nhập Mẫu

| Tài khoản (Username) | Mật khẩu (Password) | Quyền hạn (Role) |
| :--- | :--- | :--- |
| `admin` | `123456` | **Admin** (Toàn quyền) |
| `manager` | `123456` | **Quản lý** |
| `nhanvien` | `123456` | **Nhân viên** |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
DoanAnhQuan-2310900085-Project03-hatechno/
├── Hatechno+.sql                  # File Database mẫu
├── quan.comdemo/                  # Spring Boot Backend (Java REST API)
│   └── quan.comdemo/
│       ├── src/main/java/         # Controllers, Entities, Services, Repositories, Configs
│       └── src/main/resources/    # application.properties
└── frontend-react/                # Frontend ReactJS SPA (Vite + React 18)
    ├── src/
    │   ├── components/            # Layout (Sidebar, Navbar), Common (Toast, ConfirmModal)
    │   ├── context/               # AuthContext (State & JWT management)
    │   ├── pages/                 # Dashboard, Employees, Departments, Positions, Attendance, Schedule, Salary, Rewards, Leaves, Reports, Profile
    │   └── services/              # api.js (Axios REST Client)
    ├── index.html
    └── vite.config.js
```
