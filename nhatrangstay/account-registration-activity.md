# Activity: Đăng ký tài khoản NhaTrangStay

Mô tả: biểu đồ hoạt động mô tả luồng đăng ký tài khoản mới và xác thực email trong dự án.

```mermaid
flowchart TD
  A[Người dùng mở form đăng ký] --> B[Nhập username, email, password, confirmPassword]
  B --> C[Frontend gửi POST /api/auth/signup]
  C --> D[AuthController.signup()]
  D --> E[AuthService.signup(request)]
  E --> F{Email đã tồn tại?}
  F -->|Có| G[Trả lỗi: Email đã tồn tại]
  F -->|Không| H{Password và confirmPassword khớp?}
  H -->|Không| I[Trả lỗi: Mật khẩu không khớp]
  H -->|Có| J[Tạo User mới trạng thái PENDING]
  J --> K[Mã hóa mật khẩu bằng PasswordEncoder]
  K --> L[Lưu User vào users]
  L --> M[Tạo VerificationToken]
  M --> N[Lưu VerificationToken vào verification_tokens]
  N --> O[Gửi email xác thực qua EmailService]
  O --> P[Trả về đăng ký thành công]
  P --> Q[Frontend hiển thị thông báo kiểm tra email]

  %% Verify email
  Q --> R[Người dùng click link xác thực email]
  R --> S[GET /api/auth/verify?token=...]
  S --> T[AuthController.verify()]
  T --> U[AuthService.verifyEmail(token)]
  U --> V{Token hợp lệ và chưa hết hạn?}
  V -->|Không| W[Trả lỗi token không hợp lệ/đã hết hạn]
  V -->|Có| X[Đổi user.status = ACTIVE]
  X --> Y[Cập nhật user và xóa token]
  Y --> Z[Đăng ký hoàn tất, tài khoản kích hoạt]
```

## Ghi chú

- `AuthService.signup()` tạo user mới với `status = PENDING` và `role = USER`.
- Sau khi đăng ký thành công, hệ thống tạo `VerificationToken` và gửi email xác thực.
- `verifyEmail()` sẽ kích hoạt tài khoản, đổi trạng thái thành `ACTIVE`, rồi xóa token.
- Email xác thực có thời hạn 15 phút theo logic hiện tại.

## Vị trí liên quan trong mã

- `AuthController` : `src/main/java/com/truongvx64cntt/nhatrangstay/controller/AuthController.java`
- `AuthService` : `src/main/java/com/truongvx64cntt/nhatrangstay/service/AuthService.java`
- `VerificationToken` entity : `src/main/java/com/truongvx64cntt/nhatrangstay/entity/VerificationToken.java`
- `User` entity : `src/main/java/com/truongvx64cntt/nhatrangstay/entity/User.java`
