# AGENTS.md

## Tóm tắt nhanh cho AI coding agents

- Dự án là một **React SPA** cho thuê phòng trọ tại Nha Trang.
- Luồng chính được định nghĩa trong `src/routes/AppRoutes.jsx` và bọc bởi `src/App.jsx`.
- Quyền truy cập dựa trên `authToken`/`authUser` trong `localStorage` và routing phân quyền trong `src/routes/RoleBasedRoute.jsx`.
- API trung tâm được gom trong `src/lib/apiService.js` và cấu hình Axios trong `src/lib/api.js`.
- `REACT_APP_API_BASE_URL` là biến môi trường quan trọng; mặc định là `http://localhost:8080`.
- Các trang cho người dùng nằm trong `src/pages/User/*`, các trang quản trị nằm trong `src/pages/Admin/*`.

## Hướng dẫn khi làm việc trong repo

- Không sửa README một cách chung chung khi mục tiêu là demo; ưu tiên giữ tài liệu dễ hiểu cho người ngoài.
- Khi thêm tính năng, hãy cập nhật lại route và kiểm tra lại logic phân quyền trước khi đổi UI.
- Tránh hardcode URL API nếu có thể; dùng biến môi trường.
- Nếu cần tìm nhanh component, ưu tiên kiểm tra `src/routes/AppRoutes.jsx`, `src/lib/apiService.js`, và các trang tương ứng.
