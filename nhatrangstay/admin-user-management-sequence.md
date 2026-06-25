# Sequence quản lý người dùng của ADMIN

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant AdminPage as Trang quản lý người dùng
    participant AdminUserController as AdminUserController
    participant UserService as UserService
    participant UserRepository as UserRepository
    participant PostService as PostService
    participant DB as CSDL

    Admin->>AdminPage: 1. Mở trang quản lý người dùng
    AdminPage->>AdminUserController: 2. Gửi yêu cầu lấy danh sách người dùng
    AdminUserController->>UserService: 3. Gọi getAllUsers()
    UserService->>UserRepository: 4. Truy vấn toàn bộ user
    UserRepository->>DB: 5. Lấy dữ liệu
    DB-->>UserRepository: 6. Trả về danh sách user
    UserRepository-->>UserService: 7. Trả về kết quả
    UserService-->>AdminUserController: 8. Trả về danh sách
    AdminUserController-->>AdminPage: 9. Hiển thị danh sách người dùng

    Admin->>AdminPage: 10. Nhấn khóa tài khoản
    AdminPage->>AdminUserController: 11. Gửi yêu cầu khóa user
    AdminUserController->>UserService: 12. Gọi lockUser(id)
    UserService->>UserRepository: 13. Tìm user và cập nhật trạng thái
    UserRepository->>DB: 14. Lưu thay đổi
    DB-->>UserRepository: 15. Lưu thành công
    UserRepository-->>UserService: 16. Trả về kết quả
    UserService-->>AdminUserController: 17. Trả về thành công
    AdminUserController-->>AdminPage: 18. Hiển thị trạng thái đã khóa

    Admin->>AdminPage: 19. Nhấn mở khóa tài khoản
    AdminPage->>AdminUserController: 20. Gửi yêu cầu mở khóa user
    AdminUserController->>UserService: 21. Gọi unlockUser(id)
    UserService->>UserRepository: 22. Tìm user và cập nhật trạng thái
    UserRepository->>DB: 23. Lưu thay đổi
    DB-->>UserRepository: 24. Lưu thành công
    UserRepository-->>UserService: 25. Trả về kết quả
    UserService-->>AdminUserController: 26. Trả về thành công
    AdminUserController-->>AdminPage: 27. Hiển thị trạng thái hoạt động

    Admin->>AdminPage: 28. Nhấn xóa người dùng
    AdminPage->>AdminUserController: 29. Gửi yêu cầu xóa user
    AdminUserController->>UserService: 30. Gọi deleteUser(id)
    UserService->>UserRepository: 31. Xóa user khỏi CSDL
    UserRepository->>DB: 32. Xóa dữ liệu
    DB-->>UserRepository: 33. Xóa thành công
    UserRepository-->>UserService: 34. Trả về kết quả
    UserService-->>AdminUserController: 35. Trả về thành công
    AdminUserController-->>AdminPage: 36. Cập nhật danh sách

    Admin->>AdminPage: 37. Xem bài đăng của người dùng
    AdminPage->>AdminUserController: 38. Gửi yêu cầu lấy bài đăng theo user id
    AdminUserController->>PostService: 39. Gọi getPostsByUserId(id, page, size)
    PostService->>DB: 40. Truy vấn bài đăng của user
    DB-->>PostService: 41. Trả về danh sách bài đăng
    PostService-->>AdminUserController: 42. Trả về kết quả
    AdminUserController-->>AdminPage: 43. Hiển thị bài đăng của người dùng

    Admin->>AdminPage: 44. Đổi mật khẩu cho admin
    AdminPage->>AdminUserController: 45. Gửi yêu cầu đổi mật khẩu admin
    AdminUserController->>UserService: 46. Gọi changeAdminPassword(request)
    UserService->>UserRepository: 47. Tìm admin và cập nhật mật khẩu
    UserRepository->>DB: 48. Lưu thay đổi
    DB-->>UserRepository: 49. Lưu thành công
    UserRepository-->>UserService: 50. Trả về kết quả
    UserService-->>AdminUserController: 51. Trả về thành công
    AdminUserController-->>AdminPage: 52. Hiển thị thông báo đổi mật khẩu thành công
```

## Mô tả luồng

### 1. Xem danh sách người dùng
1. Admin mở trang quản lý người dùng.
2. Frontend gọi `GET /api/users`.
3. `AdminUserController` gọi `UserService.getAllUsers()`.
4. `UserService` truy vấn `UserRepository`.
5. Danh sách người dùng được trả về và hiển thị.

### 2. Khóa / mở khóa người dùng
1. Admin chọn một người dùng và nhấn khóa hoặc mở khóa.
2. Frontend gọi `PUT /api/users/lock/{id}` hoặc `PUT /api/users/unlock/{id}`.
3. `UserService` cập nhật trạng thái người dùng trong CSDL.
4. Giao diện cập nhật trạng thái mới.

### 3. Xóa người dùng
1. Admin chọn người dùng và xác nhận xóa.
2. Frontend gọi `DELETE /api/users/{id}`.
3. `UserService` xóa người dùng khỏi CSDL.
4. Danh sách người dùng được cập nhật.

### 4. Xem bài đăng của người dùng
1. Admin chọn một người dùng.
2. Frontend gọi `GET /api/users/{id}/posts?page=&size=`.
3. `AdminUserController` gọi `PostService.getPostsByUserId()`.
4. Danh sách bài đăng của user được hiển thị.

### 5. Đổi mật khẩu admin
1. Admin truy cập khu vực đổi mật khẩu.
2. Frontend gọi `PUT /api/users/change-password`.
3. `UserService.changeAdminPassword()` cập nhật mật khẩu admin.
4. Hệ thống thông báo thành công.

## Ghi chú

- Các endpoint chính:
  - `GET /api/users`
  - `PUT /api/users/lock/{id}`
  - `PUT /api/users/unlock/{id}`
  - `DELETE /api/users/{id}`
  - `GET /api/users/{id}/posts`
  - `PUT /api/users/change-password`
- `AdminUserController` đảm nhiệm toàn bộ API quản trị tài khoản.
- `UserService` xử lý logic khóa/mở khóa/xóa người dùng và đổi mật khẩu admin.
