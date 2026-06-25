# Sequence đăng ký hệ thống NhaTrangStay

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant RegisterPage as Trang đăng ký
    participant AuthController as AuthController
    participant AuthService as AuthService
    participant UserRepository as UserRepository
    participant EmailService as EmailService
    participant DB as CSDL

    User->>RegisterPage: 1. Nhập thông tin đăng ký
    RegisterPage->>AuthController: 2. Gửi yêu cầu đăng ký
    AuthController->>AuthService: 3. Xử lý đăng ký
    AuthService->>UserRepository: 4. Kiểm tra email/username đã tồn tại
    UserRepository-->>AuthService: 5. Trả về trạng thái tồn tại

    alt Email/username chưa tồn tại
        AuthService->>AuthService: 6. Mã hóa mật khẩu
        AuthService->>DB: 7. Lưu user mới
        DB-->>AuthService: 8. Lưu thành công
        AuthService->>EmailService: 9. Gửi email xác thực
        EmailService-->>AuthService: 10. Gửi email thành công
        AuthService-->>AuthController: 11. Trả về thành công
        AuthController-->>RegisterPage: 12. Hiển thị thông báo đăng ký thành công
    else Email/username đã tồn tại
        AuthService-->>AuthController: 13. Trả về lỗi
        AuthController-->>RegisterPage: 14. Hiển thị thông báo tài khoản đã tồn tại
    end
```

## Mô tả luồng

1. Người dùng truy cập trang đăng ký và nhập thông tin.
2. Frontend gửi dữ liệu đến `AuthController`.
3. `AuthController` chuyển yêu cầu sang `AuthService`.
4. `AuthService` kiểm tra dữ liệu với `UserRepository`.
5. Nếu email hoặc username đã tồn tại, hệ thống trả về lỗi.
6. Nếu hợp lệ, mật khẩu được mã hóa.
7. Thông tin người dùng được lưu vào CSDL.
8. Hệ thống gửi email xác thực cho người dùng.
9. Frontend hiển thị thông báo đăng ký thành công hoặc thất bại.

## Ghi chú

- Luồng này phản ánh chức năng đăng ký hiện có trong dự án NhaTrangStay.
- Ứng dụng đang sử dụng Spring Boot, Spring Security và gửi email xác thực cho người dùng mới.
