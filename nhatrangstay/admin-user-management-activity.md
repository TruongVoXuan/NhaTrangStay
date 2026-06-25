# Activity: Quản lý người dùng của Admin

Mô tả: biểu đồ hoạt động cho phép admin xem danh sách người dùng, khóa/mở khóa tài khoản, xóa người dùng và đổi mật khẩu admin trong ứng dụng NhaTrangStay.

```mermaid
flowchart TD
  A[Admin mở trang quản lý người dùng] --> B[GET /api/users]
  B --> C[Admin xem danh sách user (Role != ADMIN)]

  C --> D[Admin chọn một user]
  D --> E{Hành động admin}
  E -->|Khóa tài khoản| F[PUT /api/users/lock/{id}]
  E -->|Mở khóa tài khoản| G[PUT /api/users/unlock/{id}]
  E -->|Xóa user| H[DELETE /api/users/{id}]

  F --> I[AdminUserController.lockUser(id)]
  I --> J[UserService.lockUser(id)]
  J --> K[Cập nhật user.status = BANNED]
  K --> L[Gửi email thông báo khóa tài khoản]
  L --> M[Trả về "User locked"]

  G --> N[AdminUserController.unlockUser(id)]
  N --> O[UserService.unlockUser(id)]
  O --> P[Cập nhật user.status = ACTIVE]
  P --> Q[Gửi email thông báo mở khóa]
  Q --> R[Trả về "User unlocked"]

  H --> S[AdminUserController.deleteUser(id)]
  S --> T[UserService.deleteUser(id)]
  T --> U[Xóa user khỏi DB]
  U --> V[Trả về "Deleted user"]

  C --> W[GET /api/users/change-password]
  W --> X[Admin điền mật khẩu cũ/mới]
  X --> Y[PUT /api/users/change-password]
  Y --> Z[UserService.changeAdminPassword(request)]
  Z --> AA[Xác thực mật khẩu cũ với PasswordEncoder]
  AA --> AB[Cập nhật mật khẩu mới và lưu]
  AB --> AC[Trả về "Đổi mật khẩu thành công"]
```

## Chi tiết hoạt động

- `GET /api/users`
  - Chỉ admin truy cập được.
  - Trả về danh sách người dùng có role khác `ADMIN` dưới dạng `UserResponse`.

- `PUT /api/users/lock/{id}`
  - Chuyển `User.status` sang `BANNED`.
  - Gửi email cảnh báo tài khoản bị tạm khóa.

- `PUT /api/users/unlock/{id}`
  - Chuyển `User.status` sang `ACTIVE`.
  - Gửi email thông báo tài khoản được mở khóa.

- `DELETE /api/users/{id}`
  - Xóa user trực tiếp khỏi `users`.

- `PUT /api/users/change-password`
  - Admin phải cung cấp `currentPassword` và `newPassword`.
  - Kiểm tra mật khẩu cũ bằng `passwordEncoder.matches()` trước khi cập nhật.

## Lưu ý bảo mật

- Tất cả endpoint quản lý người dùng đều bảo vệ bằng `@PreAuthorize("hasRole('ADMIN')")`.
- Admin chỉ quản lý người dùng thường, không ảnh hưởng tới admin khác.
- Khóa/mở khóa tài khoản sử dụng thay đổi trạng thái để điều khiển truy cập.

## Vị trí mã liên quan

- `AdminUserController` : `src/main/java/com/truongvx64cntt/nhatrangstay/controller/AdminUserController.java`
- `UserService` : `src/main/java/com/truongvx64cntt/nhatrangstay/service/UserService.java`
- `UserResponse` DTO : `src/main/java/com/truongvx64cntt/nhatrangstay/dto/UserResponse.java`
- `User` entity : `src/main/java/com/truongvx64cntt/nhatrangstay/entity/User.java`
