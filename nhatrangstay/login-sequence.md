# Sequence đăng nhập hệ thống NhaTrangStay

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant LoginPage as Trang đăng nhập
    participant UserController as Controller Người dùng
    participant DB as CSDL

    User->>LoginPage: 1. gửi yêu cầu
    LoginPage-->>User: 2. yêu cầu nhập thông tin
    User->>LoginPage: 3. Nhập thông tin
    LoginPage->>UserController: 4. xử lý thông tin
    UserController->>DB: 5. kiểm tra thông tin
    DB-->>UserController: 6. tìm thấy/thông tin tài khoản
    UserController->>UserController: 7. kiểm tra quyền tài khoản
    UserController-->>LoginPage: 8. đăng nhập thành công/đăng nhập thất bại
    LoginPage-->>User: 9. Thông báo đăng nhập thành công/thông báo sai thông tin đăng nhập
```

**Mô tả:**
- Người dùng truy cập trang đăng nhập, nhập thông tin tài khoản.
- Controller kiểm tra thông tin với CSDL, xác thực quyền.
- Kết quả trả về: thành công hoặc thất bại, thông báo cho người dùng.

> Sơ đồ này phản ánh đúng luồng xử lý thực tế trong mã nguồn Spring Boot của đồ án NhaTrangStay.
