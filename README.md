# LAMS Backend

Backend cho hệ thống **LAMS CMS & Website**, xử lý nghiệp vụ, quản lý dữ liệu và cung cấp API cho frontend (Admin & User).

---

## Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis
- EJS (Admin CMS)
- Multer (Upload file)
- Docker (Redis)

---

## Cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd lams.ac
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

## Chạy project

### Development mode

Chạy development server:

```bash
node server.js

Mở [http://localhost:5000](http://localhost:5000) trên trình duyệt để xem website.

## Cấu trúc project

```

LAMS-CMS/
├── config/ # Cấu hình kết nối Database & Redis
│ ├── database.js # Mongoose connection
│ └── redis.js # Redis client configuration
├── controllers/ # Xử lý logic nghiệp vụ cho từng module
│ ├── aboutController.js
│ ├── contactController.js
│ ├── homepageController.js
│ └── newsController.js
├── middleware/ # Các hàm trung gian (Xác thực, Upload file)
│ ├── auth.js # Middleware kiểm tra đăng nhập Admin
│ └── upload.js # Cấu hình Multer để xử lý hình ảnh
├── models/ # Định nghĩa Schema (Mongoose)
│ ├── AboutUs.js
│ ├── Contact.js
│ ├── Homepage.js
│ └── NewsEvent.js
├── public/ # Tài nguyên tĩnh truy cập công khai
│ ├── css/ # Các file định dạng giao diện
│ ├── js/ # JavaScript phía Client (AJAX, Validation)
│ └── uploads/ # Nơi lưu trữ hình ảnh sau khi upload
├── routes/ # Định nghĩa luồng điều hướng (Routing)
│ ├── admin.js # Các route cho khu vực quản trị
│ ├── api.js # API cho frontend người dùng
│ └── upload.js # Route xử lý riêng cho upload tài nguyên
├── views/ # Giao diện hiển thị (EJS Templates)
│ ├── admin/ # Trang quản trị chi tiết
│ ├── layouts/ # Template khung (Header, Footer chung)
│ └── partials/ # Các thành phần giao diện nhỏ tái sử dụng
├── docker-compose.yml # Cấu hình chạy Docker (Redis, v.v.)
└── server.js # File khởi chạy ứng dụng chính

```

## API Endpoints Documentation

# API EndPoints Admin

1. Homepage
   GET /admin/homepage # Lấy dữ liệu homepage
   POST /admin/homepage # Cập nhật homepage

2. About Us
   GET /admin/about # Lấy nội dung About Us
   POST /admin/about # Cập nhật About Us

3. News / Events
   GET /admin/news # Lấy danh sách tin
   GET /admin/news/:id # Lấy chi tiết tin
   POST /admin/news # Tạo tin mới
   PUT /admin/news/:id # Cập nhật tin
   DELETE /admin/news/:id # Xoá tin
4. Upload
   POST /admin/image # Upload 1 hình ảnh
   POST /admin/images # Upload nhiều hình ảnh

# API Endpoints User

GET /api/homepage # Lấy homepage data
GET /api/about # Lấy about data
GET /api/news # Lấy danh sách news (support query params: page, limit, category)
GET /api/news/:slug # Lấy chi tiết news theo slug
GET /api/contact # Lấy contact data
```
