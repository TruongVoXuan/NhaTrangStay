# NhaTrangStay Frontend

## Mô tả dự án

NhaTrangStay là ứng dụng web cho thuê phòng/nhà trọ tại Nha Trang, được xây dựng bằng **React 19** và **React Router v7**. Ứng dụng giúp:

- Người dùng tìm kiếm và lọc bài đăng phòng trọ theo khu vực, giá, diện tích, loại phòng.
- Xem chi tiết bài đăng, đánh giá, và tiến hành đặt lịch/đặt trước.
- Đăng ký, đăng nhập, quên mật khẩu, đổi mật khẩu, và đăng nhập Google.
- Quản lý thông tin cá nhân, danh sách yêu thích, lịch sử đặt trước và bài đăng của mình.
- Quản lý hệ thống cho admin: dashboard thống kê, duyệt bài đăng, quản lý người dùng và cài đặt.

Frontend này hoạt động như một SPA (Single Page Application) và kết nối với backend qua API HTTP.

---

## Tính năng chính

### Người dùng

- Trang chủ với hero banner, bộ lọc tìm kiếm, sắp xếp theo đánh giá, danh sách phòng nổi bật.
- Trang chi tiết bài đăng với thông tin phòng, mô tả, đánh giá, và hành động đặt trước.
- Hệ thống xác thực người dùng (đăng nhập, đăng ký, quên/reset mật khẩu, Google OAuth).
- Trang hồ sơ cá nhân.
- Danh sách yêu thích và quản lý bài đăng cá nhân.
- Quản lý lịch sử đặt trước / đặt lịch của người dùng.
- Chatbot hỗ trợ người dùng trên giao diện.

### Admin

- Dashboard thống kê bài đăng đã duyệt và dữ liệu gần đây.
- Trang duyệt bài đăng chờ xử lý.
- Trang quản lý người dùng.
- Trang quản lý cài đặt admin.

---

## Công nghệ sử dụng

- **React 19** + **Create React App**
- **React Router DOM v7** cho điều hướng
- **Axios** cho gọi API
- **Supabase JS** cho đăng nhập Google / OAuth
- **SCSS** cho styling
- **React Toastify** cho thông báo
- **Recharts** cho biểu đồ thống kê
- **Leaflet** cho bản đồ / thông tin vị trí

---

## Cấu trúc thư mục chính

- `src/App.jsx` : root của ứng dụng, bọc provider và router.
- `src/routes/AppRoutes.jsx` : định nghĩa tất cả route và phân quyền.
- `src/hooks/useAuth.js` : quản lý trạng thái đăng nhập, token, user.
- `src/lib/apiService.js` : tập trung các API được gọi từ frontend.
- `src/lib/api.js` : cấu hình Axios, interceptor token/refresh.
- `src/pages/User/*` : các trang dành cho người dùng.
- `src/pages/Admin/*` : các trang quản trị.
- `src/components/shared/*` : các component tái sử dụng.

---

## Yêu cầu môi trường

- Node.js >= 18
- npm >= 9

Bạn cần chạy backend tương ứng trước khi demo, vì frontend phụ thuộc vào API trả về dữ liệu bài đăng, xác thực, đặt trước, quản lý bài đăng, v.v.

---

## Cài đặt và chạy dự án

```bash
npm install
npm start
```

Sau khi chạy, ứng dụng sẽ mở tại:

- http://localhost:3000

---

## Biến môi trường

Frontend đọc API base URL từ biến môi trường:

- `REACT_APP_API_BASE_URL`

Nếu không khai báo, ứng dụng sẽ mặc định gọi:

- `http://localhost:8080`

Bạn có thể tạo file `.env` ở root nếu cần chỉnh backend target.

---

## Hướng dẫn demo nhanh

### 1. Trải nghiệm người dùng

- Mở trang chủ để xem danh sách phòng.
- Dùng bộ lọc khu vực / giá / diện tích / sắp xếp theo đánh giá.
- Nhấn vào bài đăng để xem chi tiết.
- Thử đăng nhập hoặc đăng ký tài khoản.
- Vào trang hồ sơ để xem thông tin cá nhân.
- Vào danh sách yêu thích và quản lý bài đăng để xem các chức năng quản lý.

### 2. Trải nghiệm admin

- Đăng nhập bằng tài khoản admin.
- Vào `/admin/dashboard` để xem thống kê.
- Vào `/admin/pending-posts` để duyệt bài đăng.
- Vào `/admin/users` để quản lý người dùng.

> Lưu ý: nếu bạn muốn demo đầy đủ, backend phải hỗ trợ các endpoint liên quan đến auth, post, review, favorite, preorder và admin.

---

## Kiểm tra build

```bash
npm run build
```

Lệnh này tạo thư mục `build` để deploy production.

---

## Test

```bash
npm test
```

Project đã có một số test cho các trang xác thực như đăng nhập, đăng ký, reset mật khẩu.

---

## Lưu ý quan trọng khi demo

- Ứng dụng phụ thuộc vào backend chạy tại đúng URL.
- Hệ thống phân quyền dựa trên `authToken` và `authUser` trong `localStorage`.
- Nếu backend trả về role `ADMIN`, người dùng sẽ được chuyển đến trang quản trị. Nếu trả về `USER`, sẽ vào trang người dùng.
- Có tích hợp chatbot hỗ trợ tương tác trên giao diện.

---

## Tài liệu tham khảo

- [React](https://react.dev/)
- [Create React App](https://create-react-app.dev/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Supabase](https://supabase.com/)

---

## Tóm tắt nhanh

NhaTrangStay là một frontend React cho thuê phòng trọ tại Nha Trang, có đầy đủ luồng người dùng và quản trị, tích hợp xác thực, lọc tìm kiếm, quản lý bài đăng, đặt trước, danh sách yêu thích và dashboard cho admin. README này được viết để giúp người ngoài dễ hiểu ứng dụng và chạy demo nhanh.
