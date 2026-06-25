# Login Activity Diagram

Biểu đồ dưới đây thể hiện luồng đăng nhập email/password trong dự án NhaTrangStay, dựa theo `LoginPage.jsx` và `useAuth.js`.

```mermaid
flowchart TD
  A[Start] --> B[User mở trang Login]
  B --> C[Nhập email và mật khẩu]
  C --> D[Submit form]

  D --> E{Email hợp lệ?}
  E -->|No| F[Hiển thị lỗi "Email không hợp lệ"]
  E -->|Yes| G{Mật khẩu có không?}
  G -->|No| H[Hiển thị lỗi "Vui lòng nhập mật khẩu"]
  G -->|Yes| I[Gọi authAPI.login(email,password)]

  I --> J{API trả token?}
  J -->|No| K[Hiển thị toast lỗi đăng nhập]
  J -->|Yes| L[Lưu token vào localStorage]
  L --> M[Gọi authAPI.getProfile()]

  M --> N{Profile trả về hợp lệ?}
  N -->|No| O[Hiển thị toast lỗi và xóa auth nếu cần]
  N -->|Yes| P[Lưu thông tin user vào localStorage và state]
  P --> Q{Role user là ADMIN?}
  Q -->|Yes| R[Điều hướng tới /admin/dashboard]
  Q -->|No| S[Điều hướng tới /]

  F --> T[End]
  H --> T
  K --> T
  R --> T
  S --> T

  click I href "src/lib/apiService.js" "Xem authAPI.login"
  click M href "src/hooks/useAuth.js" "Xem getProfile trong useAuth"
```

## Ghi chú

- Nếu đăng nhập thành công, app lưu `authToken` và gọi `GET /api/auth/profile` để lấy dữ liệu user.
- User có role `ADMIN` sẽ được chuyển tới `/admin/dashboard`.
- User thông thường sẽ được chuyển về trang chủ `/`.
- Các lỗi hiển thị bằng `toast.error(...)` khi API thất bại.
